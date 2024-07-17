import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../error/AppError';
import httpStatus from 'http-status';
import { jwtHelpers } from '../helpers/jwtHelpers';
import config from '../config';
import { JwtPayload } from 'jsonwebtoken';

const auth = () => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req?.headers?.authorization;
    if (!token) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You are not authorized to access this',
      );
    }
    let decoded;
    try {
      decoded = jwtHelpers.verifyToken(
        token,
        config.jwt_access_secret as string,
      );
    } catch (error) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Token is expired');
    }
    if (!decoded) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Token is expired');
    }
    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
