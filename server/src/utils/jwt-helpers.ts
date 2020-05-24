// https://www.npmjs.com/package/jsonwebtoken
import jwt from 'jsonwebtoken';
import { JWTUser } from '../types/type-definitions';

const jwtOptions = {
  issuer: 'rightnow',
  expiresIn: '1d'
};

export const createJWT = (payload: JWTUser) =>
  new Promise((resolve, reject) => {
    const jwtValues = {
      email: payload.email,
      _id: payload._id,
      roles: payload.roles
    };
    jwt.sign(jwtValues, process.env.JWT_SECRET, jwtOptions, function (err, token) {
      if (err) {
        return reject(err);
      }
      resolve(token);
    });
  });

export const verifyJWT = (token: string): Promise<JWTUser> =>
  new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, jwtOptions, function (err, value) {
      if (err) {
        return reject(err);
      }
      resolve(value as JWTUser);
    });
  });