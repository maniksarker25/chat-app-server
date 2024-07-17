import { userServices } from '../services/user.service';
import sendResponse from '../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import config from '../config';

const registerUser = catchAsync(async (req, res) => {
  const result = await userServices.registerUserIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

// login user
const loginUser = catchAsync(async (req, res) => {
  const { accessToken, refreshToken } = await userServices.loginUserIntoDB(
    req.body,
  );
  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 265,
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User login successfully',
    data: {
      accessToken,
    },
  });
});

// update user
const updateUser = catchAsync(async (req, res) => {
  const result = await userServices.updateUser(req?.user?.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User updated successfully',
    data: result,
  });
});

export const userControllers = {
  registerUser,
  loginUser,
  updateUser,
};
