import jwt from 'jsonwebtoken';

// Create a new JWT
export function createJwt(options: {
  payload: string | Record<string, any>;
  type: 'access-token' | 'refresh-token' | 'reset-pw-token';
}): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      jwt.sign(
        options.payload,
        process.env.JWT_SECRET!,
        {
          issuer: process.env.JWT_ISSUER!,
          expiresIn: (() => {
            switch (options.type) {
              case 'refresh-token': {
                return process.env.REFRESH_TOKEN_JWT_EXPIRE;
              }
              case 'access-token': {
                return process.env.NEXT_PUBLIC_ACCESS_TOKEN_JWT_EXPIRE;
              }
              case 'reset-pw-token': {
                return process.env.RESET_PW_JWT_EXPIRE;
              }
              default: {
                throw Error(`Unknown JWT type: "${options.type}"`);
              }
            }
          })(),
        },
        (err, jwt) => {
          if (err) {
            return reject(err);
          }
          if (jwt) {
            return resolve(jwt);
          }
          reject('Failed to create a JWT.');
        }
      );
    } catch (err) {
      let msg = 'An unknown error occurred while trying to create a JWT.';
      if (err instanceof Error) {
        msg = err.message;
      }
      reject(msg);
    }
  });
}

// verify a JWT is valid
export function verifyJwt<T>(str: string): Promise<T> {
  return new Promise((resolve, reject) => {
    try {
      jwt.verify(
        str,
        process.env.JWT_SECRET!,
        {
          issuer: process.env.JWT_ISSUER!,
        },
        (err, value) => {
          if (err) {
            return reject(err);
          }
          if (value) {
            return resolve(value as unknown as T);
          }
          reject('Failed to verify a JWT.');
        }
      );
    } catch (err) {
      let msg = 'An error occurred while trying to verify a JWT.';
      if (err instanceof Error) {
        msg = err.message;
      }
      reject(msg);
    }
  });
}
