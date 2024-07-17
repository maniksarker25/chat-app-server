import { model, Schema } from 'mongoose';
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
  },
  {
    timestamps: true,
  },
);

const Message = model<IMessage>('message', messageSchema);

export default Message;
