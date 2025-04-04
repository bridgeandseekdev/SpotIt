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

    if (room.gameInitialized) {
      console.log('Room already initialized, ignoring duplicate request');
      return;
    }

    room.gameInitialized = true;

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

  //
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
