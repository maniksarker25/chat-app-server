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

export const userRoutes = router;
