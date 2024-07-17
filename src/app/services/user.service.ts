import httpStatus from 'http-status';
import AppError from '../error/AppError';
import { IUser } from '../interface/user.interface';
import User from '../models/user.model';
import bcrypt from 'bcrypt';
import config from '../config';
import { jwtHelpers } from '../helpers/jwtHelpers';
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

// login user
const loginUserIntoDB = async (payload: Partial<IUser>) => {
  const user = await User.findOne({ email: payload.email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const isPasswordMatched = await bcrypt.compare(
    payload?.password as string,
    user?.password,
  );
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Password does not matched');
  }

  const jwtPayload = {
    id: user?._id,
    email: user?.email,
  };

  const accessToken = jwtHelpers.createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );
  const refreshToken = jwtHelpers.createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

// update user
const updateUserIntoDB = async (id: string, payload: Partial<IUser>) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).select('-password');
  return result;
};

export const userServices = {
  registerUserIntoDB,
  loginUserIntoDB,
  updateUserIntoDB,
};
