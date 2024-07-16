import User from '../models/user.model';

const registerUser = async (req, res, next) => {
  try {
    const result = await User.create(req.body);
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
