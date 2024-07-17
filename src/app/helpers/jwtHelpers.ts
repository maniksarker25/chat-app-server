/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from 'jsonwebtoken';
const createToken = (payload: any, secret: string, expiresIn: string) => {
  const token = jwt.sign(payload, secret, {
    algorithm: 'HS256',
    expiresIn,
  });
  return token;
};

export const jwtHelpers = {
  createToken,
};
