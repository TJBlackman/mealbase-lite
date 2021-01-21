import { Response, NextFunction } from "express";
import { updateExistingUser } from "../DAL/user.dal";

// if req.user exists, 
// log their active date

export const logActiveUser = async (req: any, res: Response, next: NextFunction) => {
  if (req.user && req.user._id) {
    await updateExistingUser({
      _id: req.user._id,
      lastActiveDate: new Date().toUTCString()
    });
  }
  next();
  return;
}