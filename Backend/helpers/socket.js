import { Server } from 'socket.io';

let io;

export const init = (server, allowedOrigins) => {
  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    // console.log(`New client connected: ${socket.id}`);

    socket.on('join', (userId) => {
      socket.join(userId);
      // console.log(`User ${userId} joined their notification room`);
    });

    socket.on('disconnect', () => {
      // console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIo = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};
