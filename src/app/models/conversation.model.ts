import mongoose, { model, Schema } from 'mongoose';
import { IConversation } from '../interfaces/conversation.interface';

const conversationSchema = new Schema<IConversation>(
  {
    sender: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: 'User',
    },
    receiver: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: 'User',
    },
    message: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Message',
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Conversation = model<IConversation>('Conversation', conversationSchema);

export default Conversation;
