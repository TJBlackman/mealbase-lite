import express from 'express';
const router = express.Router();

import allowLoggedInUsersOnly from '../middleware/auth-users-only';

import {
  queryAllUsers,
  registerNewUser,
  editExistingUser,
  markUserDeleted,
} from '../services/user.service';
import { sendResponse } from '../utils/normalize-response';
import { createJWT } from '../utils/jwt-helpers';
import { JWTUser } from '..//types/type-definitions';

// GET /api/v1/users
router.get('/', async (req, res, next) => {
  try {
    const response = await queryAllUsers(req.query, req.user as JWTUser);

    sendResponse({
      req,
      res,
      data: response,
      message: '',
      success: true,
    });
  } catch (err) {
    sendResponse({
      req,
      res,
      message: err.message,
      success: false,
    });
  }
});

// GET /api/v1/users/my-cookie
router.get('/my-cookie', (req, res, next) => {
  sendResponse({
    req,
    res,
    data: req.user,
    message: '',
    success: true,
  });
})

// POST /api/v1/users
// Needs recaptcha middleware
router.post('/', async (req, res, next) => {
  try {
    const response: any = await registerNewUser(req.body);
    const jwt = await createJWT({
      _id: response._id,
      email: response.email,
      roles: response.roles,
      organizations: {
        admin: [],
        member: [],
      },
    });
    sendResponse({
      req,
      res,
      cookie: jwt,
      data: response,
      message: '',
      success: true,
    });
  } catch (err) {
    sendResponse({
      req,
      res,
      message: err.message,
      success: false,
    });
  }
});

// PUT /api/v1/users
router.put('/', allowLoggedInUsersOnly, async (req, res, next) => {
  try {
    const response = await editExistingUser(req.body, req.user as JWTUser);
    sendResponse({
      req,
      res,
      data: response,
      message: '',
      success: true,
    });
  } catch (err) {
    console.log(err);
    sendResponse({
      req,
      res,
      message: err.message,
      success: false,
    });
  }
});

// DELETE /api/v1/users
router.delete('/', allowLoggedInUsersOnly, async (req, res, next) => {
  try {
    await markUserDeleted(req.body, req.user as JWTUser);
    sendResponse({
      req,
      res,
      message: '',
      success: true,
    });
  } catch (err) {
    sendResponse({
      req,
      res,
      message: err.message,
      success: false,
    });
  }
});

export default router;
