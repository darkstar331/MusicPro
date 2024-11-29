// server.js

const { createServer } = require('http');
const next = require('next');
const socketIo = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;

app.prepare().then(() => {
  const server = createServer((req, res) => {
    // Let Next.js handle all other requests
    handle(req, res);
  });

  const io = socketIo(server);

  // Handle Socket.IO connections
  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('sendMessage', (message) => {
      // Broadcast the message to all connected clients
      io.emit('receiveMessage', message);
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
