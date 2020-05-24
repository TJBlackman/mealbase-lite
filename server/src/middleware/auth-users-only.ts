import { sendResponse } from '../utils/normalize-response';

// check that all requests have a req.user property
// before allowing them to continue
// aka: logged in users only past this point

export default (req: any, res: any, next: any) => {
  if (!req.user) {
    return sendResponse({
      req,
      res,
      success: false,
      message: '401 Unauthorized',
      status: 401,
      cookie: 'clear'
    });
  }
  if (!req.user._id) {
    return sendResponse({
      req,
      res,
      success: false,
      message: '401 Unauthorized',
      status: 401,
      cookie: 'clear'
    });
  }
  next();
};
