import express from 'express';
import validateRequest from '../middlewares/validateRequest';
import { userValidations } from '../validations/user.validation';
import { userControllers } from '../controllers/user.controller';

const router = express.Router();

router.post(
  '/register',
  validateRequest(userValidations.registerUserValidationSchema),
  userControllers.registerUser,
);

router.post(
  '/login',
  validateRequest(userValidations.loginUserValidationSchema),
  userControllers.loginUser,
);

export const userRoutes = router;
