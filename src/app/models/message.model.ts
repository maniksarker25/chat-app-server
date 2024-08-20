import mongoose, { model, Schema } from 'mongoose';
import { IMessage } from '../interface/message.interface';

const messageSchema = new Schema<IMessage>(
  {
    text: {
      type: String,
      default: '',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    videoUrl: {
      type: String,
      default: '',
    },
    seen: {
      type: Boolean,
      default: false,
    },
    msgByUserId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);

const Message = model<IMessage>('Message', messageSchema);

export default Message;
