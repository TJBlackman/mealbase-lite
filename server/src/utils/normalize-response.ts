import { createJWT, createUserJWT } from "./jwt-helpers";

interface IProps {
  req: any;
  res: any;
  message: string;
  success: boolean;
  cookie?: 'clear' | string;
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

const twentyFourHours = 1000 * 60 * 60 * 24;

export const sendResponse = async (options: IProps) => {
  const { req, res, message = '', success = false, data = null, errorCode, status = 200 } = options;
  let { cookie } = options;

  const responseModel: any = {
    message,
    success
  };

  // if req.user exists (is loggedIn)
  // if JWT is more than 24 hours old
  // refresh JWT and cookie
  if (req.user && !cookie) {
    const issuedAt = req.user.iat * 1000;
    const timeSinceThen = Date.now() - issuedAt;
    if (timeSinceThen > twentyFourHours) {
      delete req.user.exp;
      delete req.user.iss;
      const userValuesInJwt = await createUserJWT({ ...req.user });
      cookie = userValuesInJwt;
    }
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
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * parseInt(process.env.COOKIE_TIMEOUT_DAYS, 10))
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
