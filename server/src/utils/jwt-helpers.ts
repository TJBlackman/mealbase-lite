// https://www.npmjs.com/package/jsonwebtoken
import jwt from 'jsonwebtoken';
import { JWTUser } from '../types/type-definitions';

const jwtOptions = {
  issuer: 'mealbase',
  expiresIn: process.env.JWT_DEFAULT_EXPIRE
};

export const createUserJWT = (payload: JWTUser, options?: Partial<typeof jwtOptions>) =>
  new Promise((resolve, reject) => {
    const jwtValues = {
      email: payload.email,
      _id: payload._id,
      roles: payload.roles
    };
    jwt.sign(jwtValues, process.env.JWT_SECRET, { ...jwtOptions, ...options }, (err, token) => {
      if (err) {
        return reject(err);
      }
      resolve(token);
    });
  });

export const verifyUserJWT = (token: string): Promise<JWTUser> =>
  new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, jwtOptions, (err, value) => {
      if (err) {
        return reject(err);
      }
      resolve(value as JWTUser);
    });
  });

export const createJWT = (payload: object | string, options?: Partial<typeof jwtOptions>) => new Promise<string>((resolve, reject) => {
  jwt.sign(payload, process.env.JWT_SECRET, { ...jwtOptions, ...options }, (err, token) => {
    if (err) {
      return reject(err);
    }
    resolve(token);
  });
});
export const verifyJWT = <T>(token: string): Promise<T> =>
  new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, jwtOptions, (err, value) => {
      if (err) {
        return reject(err);
      }
      resolve(value as unknown as T);
    });
  });
