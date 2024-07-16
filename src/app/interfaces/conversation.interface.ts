import { Types } from 'mongoose';

export interface IConversation {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  message: string[];
}
