import { usePassportLocalStrategy } from '../middleware/passport';
import { createUserJWT } from '../utils/jwt-helpers';
import express from 'express';
import { sendResponse } from '../utils/normalize-response';
import { requestResetPassword, confirmResetPassword } from "../services/user.service";
const router = express.Router();

// POST /api/v1/auth/local
router.post('/local', usePassportLocalStrategy, async (req, res) => {
  const user: any = { ...req.user };
  const jwt = await createUserJWT({
    _id: user._id,
    email: user.email,
    roles: user.roles,
    organizations: {
      admin: [],
      member: [],
    },
  });
  sendResponse({
    req,
    res,
    cookie: jwt,
    data: {
      _id: user._id,
      email: user.email,
      roles: user.roles,
    },
    success: true,
    message: '',
  });
});

// GET /api/v1/auth/signout
router.get('/signout', (req, res, next) => {
  sendResponse({
    req,
    res,
    success: true,
    message: '',
    cookie: 'clear',
  });
});

// POST /api/auth/request-reset-password'
router.post('/request-reset-password', async (req, res) => {
  try {
    await requestResetPassword(req.body);
    sendResponse({
      req,
      res,
      success: true,
      message: 'Email Sent!',
    });
  }
  catch (err) {
    sendResponse({
      req,
      res,
      success: false,
      message: err.message,
    })
  }
});

// POST /api/auth/confirm-reset-password'
router.post('/confirm-reset-password', async (req, res) => {
  try {
    const result = await confirmResetPassword(req.body);
    sendResponse({
      req,
      res,
      success: true,
      message: 'Password successfully reset!',
      data: result
    });
  }
  catch (err) {
    sendResponse({
      req,
      res,
      success: false,
      message: err.message,
    })
  }
});


export default router;
