import { IUser } from '../interfaces/user.interface';
import User from '../models/user.model';

const registerUserIntoDB = async (payload: IUser) => {
  const result = await User.create(payload);
  return result;
};

export const userServices = {
  registerUserIntoDB,
};
