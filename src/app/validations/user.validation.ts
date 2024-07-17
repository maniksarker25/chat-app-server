import { z } from 'zod';

const registerUserValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be a valid string',
    }),
    email: z.string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must a valid email',
    }),
    password: z.string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string',
    }),
    profile_pic: z.string({
      required_error: 'Profile picture is required',
      invalid_type_error: 'Profile pic must be a string',
    }),
  }),
});

const loginUserValidationSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    }),
  }),
});

//
const updateUserValidationSchema = z.object({
  body: z.object({
    name: z.string({ invalid_type_error: 'Name must be a string' }).optional(),
    profile_pic: z
      .string({ invalid_type_error: 'Profile pic must be a string' })
      .optional(),
  }),
});

export const userValidations = {
  registerUserValidationSchema,
  loginUserValidationSchema,
  updateUserValidationSchema,
};
