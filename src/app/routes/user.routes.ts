import express from 'express';
import validateRequest from '../middlewares/validateRequest';
import { userValidations } from '../validations/user.validation';
import { userControllers } from '../controllers/user.controller';
import auth from '../middlewares/auth';

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
router.get('/my-profile', auth(), userControllers.getMyProfile);
router.get('/', auth(), userControllers.getAllUsers);
router.patch(
  '/update-profile',
  auth(),
  validateRequest(userValidations.updateUserValidationSchema),
  userControllers.updateUser,
);

export const userRoutes = router;
