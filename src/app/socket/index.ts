import express, { Application } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import http, { Server as HTTPServer } from 'http';
import getUserDetailsFromToken from '../helpers/getUserDetailsFromToken';

export const app: Application = express();

// Create an HTTP server
export const server: HTTPServer = http.createServer(app);

// Initialize Socket.IO server with CORS configuration
const io = new SocketIOServer(server, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
});

// online user
const onlineUser = new Set();

// Socket.IO connection event
io.on('connection', async (socket) => {
  console.log('User connected:', socket.id);
  const token = socket.handshake.auth.token;
  console.log(token);
  // current user details
  const currentUser = await getUserDetailsFromToken(token);
  // console.log(currentUser);
  const userId = currentUser?._id.toString();
  // create a room-------------------------
  socket.join(userId as string);
  // set online user
  onlineUser.add(userId);
  // send to the client
  io.emit('onlineUser', Array.from(onlineUser));

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    onlineUser.delete(userId);
  });
});

// export { app, server };
