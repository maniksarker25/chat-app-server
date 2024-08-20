import express, { Application } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import http, { Server as HTTPServer } from 'http';
import getUserDetailsFromToken from '../helpers/getUserDetailsFromToken';
import User from '../models/user.model';
import Conversation from '../models/conversation.model';
import Message from '../models/message.model';

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
  // console.log(token);
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

  // message page
  socket.on('message-page', async (userId) => {
    console.log('Received message-page for userId:', userId);

    const userDetails = await User.findById(userId).select('-password');
    if (userDetails) {
      const payload = {
        _id: userDetails._id,
        name: userDetails.name,
        email: userDetails.email,
        profile_pic: userDetails?.profile_pic,
        online: onlineUser.has(userId),
      };
      socket.emit('message-user', payload);
    } else {
      console.log('User not found');
    } // Fetch user details from the database
  });

  // new message -----------------------------------
  socket.on('new message', async (data) => {
    console.log('new message ', data);
    let conversation = await Conversation.findOne({
      $or: [
        { sender: data?.sender, receiver: data?.receiver },
        { sender: data?.receiver, receiver: data?.sender },
      ],
    });
    // console.log(conversation);
    // if conversation is not available then create a new conversation
    if (!conversation) {
      conversation = await Conversation.create({
        sender: data?.sender,
        receiver: data?.receiver,
      });
    }
    const messageData = {
      text: data.text,
      imageUrl: data.imageUrl,
      videoUrl: data.videoUrl,
      msgByUserId: data?.msgByUserId,
    };
    const saveMessage = await Message.create(messageData);
    const updateConversation = await Conversation.updateOne(
      { _id: conversation?._id },
      {
        $push: { messages: saveMessage?._id },
      },
    );
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    onlineUser.delete(userId);
    console.log('User disconnected:', socket.id);
  });
});

// export { app, server };
