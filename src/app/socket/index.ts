import express, { Application } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import http, { Server as HTTPServer } from 'http';
import getUserDetailsFromToken from '../helpers/getUserDetailsFromToken';
import User from '../models/user.model';
import Conversation from '../models/conversation.model';
import Message from '../models/message.model';
import { getConversation } from '../helpers/getConversation';

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
  const currentUserId = currentUser?._id.toString();
  // create a room-------------------------
  socket.join(currentUserId as string);
  // set online user
  onlineUser.add(currentUserId);
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
    }
    //get previous message
    const getConversationMessage = await Conversation.findOne({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId },
      ],
    })
      .populate('messages')
      .sort({ updatedAt: -1 });

    console.log('previous conversation message', getConversationMessage);

    socket.emit('message', getConversationMessage?.messages || []);
  });

  // new message -----------------------------------
  socket.on('new message', async (data) => {
    // console.log('new message ', data);
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
    console.log(updateConversation);
    // get the conversation
    const getConversationMessage = await Conversation.findOne({
      $or: [
        { sender: data?.sender, receiver: data?.receiver },
        { sender: data?.receiver, receiver: data?.sender },
      ],
    })
      .populate('messages')
      .sort({ updatedAt: -1 });
    // console.log('conversation mesage', getConversationMessage);
    // send to the frontend ---------------
    io.to(data?.sender).emit('message', getConversationMessage?.messages || []);
    io.to(data?.receiver).emit(
      'message',
      getConversationMessage?.messages || [],
    );

    //send conversation
    const conversationSender = await getConversation(data?.sender);
    const conversationReceiver = await getConversation(data?.receiver);

    io.to(data?.sender).emit('conversation', conversationSender);
    io.to(data?.receiver).emit('conversation', conversationReceiver);
  });

  // sidebar
  socket.on('sidebar', async (crntUserId) => {
    const conversation = await getConversation(crntUserId);
    // console.log(conversation);
    socket.emit('conversation', conversation);
  });

  // send
  socket.on('seen', async (msgByUserId) => {
    const conversation = await Conversation.findOne({
      $or: [
        { sender: currentUserId, receiver: msgByUserId },
        { sender: msgByUserId, receiver: currentUserId },
      ],
    });

    const conversationMessageId = conversation?.messages || [];
    // update the messages
    const updateMessages = await Message.updateMany(
      { _id: { $in: conversationMessageId }, msgByUserId: msgByUserId },
      { $set: { seen: true } },
    );

    //send conversation
    const conversationSender = await getConversation(currentUserId as string);
    const conversationReceiver = await getConversation(msgByUserId);

    io.to(currentUserId as string).emit('conversation', conversationSender);
    io.to(msgByUserId).emit('conversation', conversationReceiver);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    onlineUser.delete(currentUserId);
    console.log('User disconnected:', socket.id);
  });
});

// export { app, server };
