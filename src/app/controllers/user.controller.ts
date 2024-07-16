import { NextFunction, Request, Response } from 'express';
import { userServices } from '../services/user.service';
import sendResponse from '../utils/sendResponse';
import httpStatus from 'http-status';

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await userServices.registerUserIntoDB(req.body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'User registered successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const userControllers = {
  registerUser,
};
