import { usePassportLocalStrategy } from '../middleware/passport';
import { createJWT } from '../utils/jwt-helpers';
import express from 'express';
import { sendResponse } from '../utils/normalize-response';
import { resetUserPassword } from "../services/user.service";
const router = express.Router();

// POST /api/v1/auth/local
router.post('/local', usePassportLocalStrategy, async (req, res) => {
  const user: any = { ...req.user };
  const jwt = await createJWT({
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

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const result = await resetUserPassword(req.body);
    sendResponse({
      req,
      res,
      success: true,
      message: 'Email sent.',
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
})
export default router;
