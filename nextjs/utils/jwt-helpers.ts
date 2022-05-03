import jwt from "jsonwebtoken";

const jwtOptions = {
  issuer: "mealbase",
  expiresIn: process.env.JWT_TIMEOUT!,
};

// Create a new JWT
export function createJwt(
  payload: string | Record<string, any>
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      jwt.sign(payload, process.env.JWT_SECRET!, jwtOptions, (err, jwt) => {
        if (err) {
          return reject(err);
        }
        if (jwt) {
          return resolve(jwt);
        }
        reject("Failed to create a JWT.");
      });
    } catch (err) {
      let msg = "An unknown error occurred while trying to create a JWT.";
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
      jwt.verify(str, process.env.JWT_SECRET!, jwtOptions, (err, value) => {
        if (err) {
          return reject(err);
        }
        if (value) {
          return resolve(value as unknown as T);
        }
        reject("Failed to verify a JWT.");
      });
    } catch (err) {
      let msg = "An error occurred while trying to verify a JWT.";
      if (err instanceof Error) {
        msg = err.message;
      }
      reject(msg);
    }
  });
}
