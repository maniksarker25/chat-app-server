import { model, Schema } from 'mongoose';
import { IUser } from '../interfaces/user.interface';

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profile_pic: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  },
);

userSchema.post('save', function (doc, next) {
  doc.set('password', undefined);
  next();
});

const User = model<IUser>('User', userSchema);

export default User;
