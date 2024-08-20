import { Types } from 'mongoose';

export interface IMessage {
  text: string;
  imageUrl: string;
  videoUrl: string;
  seen: boolean;
  msgByUserId: Types.ObjectId;
}
