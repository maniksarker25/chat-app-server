import { NextFunction, Request, Response } from 'express';
import { userServices } from '../services/user.service';

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await userServices.registerUserIntoDB(req.body);
    res.status(200).json({
      success: true,
      message: 'User created successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const userControllers = {
  registerUser,
};
