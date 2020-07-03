import { usePassportLocalStrategy } from '../middleware/passport';
import { createJWT, verifyJWT } from '../utils/jwt-helpers';
import express from 'express';
import { sendResponse } from '../utils/normalize-response';
const router = express.Router();

// POST /api/v1/auth/local
// goal is to authenticate and send back token: jwt
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

export default router;
