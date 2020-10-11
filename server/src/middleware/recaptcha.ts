import axios from 'axios';
import { Response, Request, NextFunction } from 'express';
import { sendResponse } from "../utils/normalize-response";

export const recaptchaMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);
  if (!req.body.recaptcha) {
    sendResponse({
      req,
      res,
      success: false,
      message: 'ReCaptcha is required.'
    });
    return;
  }
  console.log({
    secret: process.env.GOOGLE_RECAPTCHA_SERVER_KEY,
    response: req.body.recaptcha
  })
  const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.GOOGLE_RECAPTCHA_SERVER_KEY}&response=${req.body.recaptcha}`);
  console.log(response.data);
  if (!response.data.success) {
    sendResponse({
      req,
      res,
      success: false,
      message: 'ReCaptcha is invalid.'
    });
    return;
  }
  next();
}