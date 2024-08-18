import httpStatus from 'http-status';
import AppError from '../error/AppError';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import User from '../models/user.model';

const getUserDetailsFromToken = async (token: string) => {
  if (!token) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid token');
  }
  const decode = (await jwt.verify(
    token,
    config.jwt_access_secret as string,
  )) as JwtPayload;
  const user = await User.findById(decode?.id).select('-password');
  return user;
};

export default getUserDetailsFromToken;
