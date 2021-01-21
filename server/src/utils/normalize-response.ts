import express, { response } from 'express';

interface IProps {
  req: any;
  res: any;
  message: string;
  success: boolean;
  cookie?: 'clear' | any | null;
  data?: any;
  errorCode?: number | null;
  status?: number;
}

interface IResponseModel {
  message: string;
  success: boolean;
  data?: object | [] | null;
  errorCode?: number | string;
}

export const sendResponse = async (options: IProps) => {
  const { req, res, message = '', success = false, data = null, cookie = null, errorCode, status = 200 } = options;

  const responseModel: any = {
    message,
    success
  };

  // refresh existing cookie
  if (req.user) {
    res.cookie(process.env.COOKIE_NAME, { ...req.user }, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * parseInt(process.env.COOKIE_TIMEOUT_DAYS))
    });
  }

  // assign new cookie, or clear existing cookie
  if (cookie) {
    if (cookie === 'clear') {
      res.cookie(process.env.COOKIE_NAME, 'Happy Birthday!', {
        httpOnly: true,
        expires: new Date('Tue Sep 19 1989 00:00:00 GMT')
      });
    } else {
      res.cookie(process.env.COOKIE_NAME, cookie, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * parseInt(process.env.COOKIE_TIMEOUT_DAYS))
      });
    }
  }

  if (data) {
    responseModel.data = data;
  }
  if (errorCode) {
    responseModel.errorCode = errorCode;
  }

  return res.status(status).send(responseModel);
};
