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
  console.log(`User connected: ${socket.id}`);

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
