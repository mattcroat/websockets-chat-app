const express = require('express');
const socket = require('socket.io');

// App setup
const app = express();
const server = app.listen(4000, () => {
  console.log('Listening to request on port 4000');
});

// Static files
app.use(express.static('public'));

// Socket setup
const io = socket(server);

// Listen for event
io.on('connection', (socket) => {
  console.log('🧦  Made socket connection', socket.id);

  // Handle chat event
  socket.on('chat', (data) => {
    // Make it so that everyone can see the message
    io.sockets.emit('chat', data);
  });

  socket.on('typing', (data) => {
    // Broadcast typing message
    socket.broadcast.emit('typing', data);
  });
});
