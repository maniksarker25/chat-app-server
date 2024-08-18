import express, { Application } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import http, { Server as HTTPServer } from 'http';

const app: Application = express();

// Create an HTTP server
const server: HTTPServer = http.createServer(app);

// Initialize Socket.IO server with CORS configuration
const io = new SocketIOServer(server, {
  cors: {
    origin: 'http://localhost:3000', // Allow requests from this origin
    credentials: true, // Enable credentials
  },
});

// Socket.IO connection event
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

export { app, server };
