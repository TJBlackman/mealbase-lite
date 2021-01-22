import { Response, NextFunction } from "express";
import { updateExistingUser } from "../DAL/user.dal";

// if req.user exists (is loggedIn)
// if JWT is more than 12 hours old
// update user's lastActiveDate property

const twelveHours = 1000 * 60 * 60 * 12;

export async function logActiveUser(req: any, res: Response, next: NextFunction) {
  if (req.user) {
    const issuedAt = req.user.iat * 1000;
    const date = new Date();
    const timeSinceThen = date.getTime() - issuedAt;
    if (timeSinceThen > twelveHours) {
      await updateExistingUser({
        _id: req.user._id,
        lastActiveDate: date.toUTCString()
      });
    } else {
    }
  }
  next();
  return;
}