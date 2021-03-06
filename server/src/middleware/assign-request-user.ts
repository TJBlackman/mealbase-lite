import { verifyUserJWT } from '../utils/jwt-helpers';

// req.user is ALWAYS false, unless this function updates it from an existing JWT
// passport middleware for certain routes can also set this
// add data to req.user if it's available, else it's null

export async function assignRequestUser(req: any, res: any, next: any) {
  req.user = false;
  const jwtFromCookie = req.cookies[process.env.COOKIE_NAME];
  if (jwtFromCookie) {
    try {
      const jwtValue = await verifyUserJWT(jwtFromCookie);
      req.user = jwtValue;
    } catch (err) {
      console.log(err);
    }
  }
  next();
};
