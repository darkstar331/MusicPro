// pages/api/socket.js

import { Server } from 'socket.io';

export default function SocketHandler(req, res) {
  if (!res.socket.server.io) {
    console.log('Initializing Socket.io');
    const io = new Server(res.socket.server);

    io.on('connection', (socket) => {
      socket.on('sendMessage', (msg) => {
        // Emit to all clients except the sender
        socket.broadcast.emit('receiveMessage', msg);
      });
    });

    res.socket.server.io = io;
  } else {
    console.log('Socket.io is already running');
  }
  res.end();
}
