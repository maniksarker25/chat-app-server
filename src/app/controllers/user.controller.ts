import { userServices } from '../services/user.service';
import sendResponse from '../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';

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
  const result = await userServices.loginUserIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User login successfully',
    data: result,
  });
});

export const userControllers = {
  registerUser,
  loginUser,
};
