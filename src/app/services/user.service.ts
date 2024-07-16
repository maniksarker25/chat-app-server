import httpStatus from 'http-status';
import AppError from '../error/AppError';
import { IUser } from '../interfaces/user.interface';
import User from '../models/user.model';
import bcrypt from 'bcrypt';
import config from '../config';
import { number } from 'zod';
const registerUserIntoDB = async (payload: IUser) => {
  const user = await User.findOne({ email: payload.email });
  // check if user is already registered
  if (user) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This user is already registered',
    );
  }
  // hash the password
  const hashedPassword = await bcrypt.hash(
    payload?.password,
    Number(config.bcrypt_salt_rounds),
  );

  const userData = {
    name: payload?.name,
    email: payload?.email,
    profile_pic: payload?.profile_pic,
    password: hashedPassword,
  };

  const result = await User.create(userData);
  return result;
};

export const userServices = {
  registerUserIntoDB,
};
