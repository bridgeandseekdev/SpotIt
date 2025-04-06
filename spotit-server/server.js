const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const rooms = {};
const games = {};

//basic health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id} at ${new Date().toLocaleString()}`);

  //Create a new lobby
  socket.on('create_room', ({ username }) => {
    const roomId = uuidv4().substring(0, 6);
    rooms[roomId] = {
      hostId: socket.id,
      players: [{ id: socket.id, username }],
      createdAt: Date.now(),
      active: true,
    };

    socket.join(roomId);
    socket.emit('room_created', { roomInfo: rooms[roomId], roomId });
  });

  //Join an existing lobby
  socket.on('join_room', ({ roomId, username }) => {
    const room = rooms[roomId];

    if (!room) {
      return socket.emit('error', { message: 'Room not found' });
    }

    if (!room.active) {
      return socket.emit('error', { message: 'Room is no longer active' });
    }

    if (room.players.length >= 2) {
      return socket.emit('error', { message: 'Room is full' });
    }

    const player = { id: socket.id, username };
    room.players.push(player);

    socket.join(roomId);
    socket.emit('room_joined', {
      player,
      roomId,
      hostId: room.hostId,
    });

    io.to(roomId).emit('player_joined', {
      players: room.players,
    });
  });
  //start game(initialized with the frontend generated deck)
  socket.on('initialize_game', ({ roomId, deck }) => {
    console.log('initialization request');

    const room = rooms[roomId];

    if (!room) {
      return socket.emit('error', { message: 'Room not found' });
    }

    if (!room.active) {
      return socket.emit('error', { message: 'Room is no longer active' });
    }

    if (room.players.length !== 2) {
      return socket.emit('error', { message: 'Error: Cannot start the game' });
    }

    const pileCard = deck.pop();
    const midpoint = Math.floor(deck.length / 2);
    const player1Deck = deck.slice(0, midpoint);
    const player2Deck = deck.slice(midpoint);

    const gameId = uuidv4();
    games[gameId] = {
      roomId,
      gameStatus: 'idle',
      startedAt: Date.now(),
      pileCard,
      pileCardMatchQueue: [],
      isProcessingMatch: false, //Processing lock
      players: {
        [room.players[0].id]: {
          deck: player1Deck,
          currentCard: player1Deck[0],
          score: 0,
          cardsRemaining: player1Deck.length,
          username: room.players[0].username,
        },
        [room.players[1].id]: {
          deck: player2Deck,
          currentCard: player1Deck[1],
          score: 0,
          cardsRemaining: player2Deck.length,
          username: room.players[1].username,
        },
      },
    };

    io.to(roomId).emit('game_initialized', {
      gameId,
      pileCard,
      players: games[gameId].players,
      gameStatus: games[gameId].gameStatus,
    });
  });

  //5s countdown before the game starts for players to get ready.
  socket.on('start_countdown', ({ roomId, gameId }) => {
    let countdown = 3; // 5 seconds countdown

    // Broadcast initial countdown value
    io.to(roomId).emit('countdown_update', countdown);

    // Set up interval to count down
    const intervalId = setInterval(() => {
      countdown--;

      // Broadcast updated countdown value
      io.to(roomId).emit('countdown_update', countdown);

      // When countdown reaches zero
      if (countdown <= 0) {
        clearInterval(intervalId); // Stop the interval
        games[gameId].gameStatus = 'playing';
        io.to(roomId).emit('game_started'); // Tell clients game is starting
      }
    }, 1000); // Run every second
  });

  //Handle match attempt
  socket.on('check_match', ({ gameId, symbol }) => {
    const game = games[gameId];
    console.log('game', game);
    const room = rooms[game.roomId];
    if (!room) {
      return socket.emit('error', { message: 'Room not found' });
    }

    if (!room.active) {
      return socket.emit('error', { message: 'Room is no longer active' });
    }

    if (!game || game.gameStatus !== 'playing') {
      return socket.emit('error', { message: 'Game not found or not active' });
    }

    const playerId = socket.id;
    const playerData = game.players[playerId];

    if (!playerData) {
      return socket.emit('error', { message: 'Game not found or not active' });
    }

    //Create a unique match request with timestamp
    const matchRequest = {
      playerId,
      symbol,
      timeStamp: Date.now(),
    };

    //Add to the current pile card's queue
    game.pileCardMatchQueue.push(matchRequest);
    console.log('Queue:', game.pileCardMatchQueue);

    //Process queue if not already processing
    if (!game.isProcessingMatch) {
      processPileCardMatchQueue(gameId);
    }
  });

  //Process match requests for the current pile card
  function processPileCardMatchQueue(gameId) {
    const game = games[gameId];
    if (
      !game ||
      game.gameStatus !== 'playing' ||
      game.pileCardMatchQueue.length === 0
    )
      return;

    //Set processing flag
    game.isProcessingMatch = true;

    //Sort the requests
    game.pileCardMatchQueue.sort((a, b) => a.timeStamp - b.timeStamp);

    //Process the earliest request
    const request = game.pileCardMatchQueue.shift();
    const { playerId, symbol } = request;
    const playerData = game.players[playerId];
    console.log('player data', playerData);

    if (!playerData) {
      //skip invalid requests
      game.isProcessingMatch = false;
      if (game.pileCardMatchQueue.length > 0) {
        processPileCardMatchQueue(gameId);
      }
      return;
    }

    const playerCurrentCard = playerData.currentCard;
    console.log('playerCurrentCard', playerCurrentCard);
    const pileCard = game.pileCard;
    console.log('pileCard', pileCard);

    //Check if the chosen symbol exists in both cards
    const isMatch = pileCard.some((card) => card.symbol === symbol);

    if (isMatch) {
      //update player state
      playerData.deck.shift();
      playerData.score += 1;
      playerData.cardsRemaining = playerData.deck.length;

      // Set new current card or end game if deck is empty
      if (playerData.deck.length > 0) {
        playerData.currentCard = playerData.deck[0];

        // Change the pile card
        game.pileCard = playerCurrentCard; // Previous player card becomes new pile card

        //Clear the match queue - all queued match requests are now irrelevant as they were for the previous pile card
        const pendingRequests = [...game.pileCardMatchQueue];
        game.pileCardMatchQueue = [];

        // Send match_failed to all pending requests that re now obsolete
        pendingRequests.forEach((req) => {
          io.to(req.playerId).emit('match_failed', {
            message: 'Another player matched first',
            symbol: req.symbol,
          });
        });

        // Notify both players about the match
        io.to(game.roomId).emit('match_success', {
          playerId,
          newPileCard: playerCurrentCard,
          playerScore: playerData.score,
          playerCardsRemaining: playerData.cardsRemaining,
          nextPlayerCard: playerData.currentCard,
          matchedSymbol: symbol,
          updatedDeck: playerData.deck,
        });
      } else {
        // Player has finished their deck - they win!
        game.gameStatus = 'gameOver';
        game.winner = playerId;

        const otherPlayerId = Object.keys(game.players).find(
          (id) => id !== playerId,
        );

        io.to(game.roomId).emit('game_over', {
          winner: playerId,
          finalScores: {
            [playerId]: game.players[playerId].score,
            [otherPlayerId]: game.players[otherPlayerId].score,
          },
        });

        // Clean up game after 5 minutes
        setTimeout(() => {
          delete games[gameId];
        }, 300000);
      }
    } else {
      //Incorrect match attempt
      socket.emit('match_failed', {
        message: 'Incorrect match',
        symbol,
      });
    }

    // Reset processing flag and continue with next request if any
    game.isProcessingMatch = false;
    if (game.pileCardMatchQueue.length > 0) {
      processPileCardMatchQueue(gameId);
    }
  }

  //Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

//Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server, io };
