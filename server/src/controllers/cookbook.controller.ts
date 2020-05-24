import express from 'express';
import { sendResponse } from '../utils/normalize-response';
import { getCookbooks, createNewCookbook, editCookbook, deleteCookbook } from '../services/cookbook.service';
import { JWTUser } from '../types/type-definitions';
const router = express.Router();

// GET /api/v1/cookbooks
router.get('/', async (req, res, next) => {
  try {
    const cookbooks = await getCookbooks(req.query, req.user as JWTUser);
    sendResponse({
      req,
      res,
      message: '',
      success: true,
      data: cookbooks
    })
  }
  catch (err) {
    sendResponse({
      req,
      res,
      message: err.message,
      success: false
    })
  }
})
// POST /api/v1/cookbooks
router.post('/', async (req, res, next) => {
  try {
    const cookbook = await createNewCookbook(req.body, req.user as JWTUser)
    sendResponse({
      req,
      res,
      message: '',
      success: true,
      data: cookbook
    })
  }
  catch (err) {
    sendResponse({
      req,
      res,
      message: err.message,
      success: false
    })
  }
})
// PUT /api/v1/cookbooks
router.put('/', async (req, res, next) => {
  try {
    const cookbook = await editCookbook(req.body, req.user as JWTUser);
    sendResponse({
      req,
      res,
      message: '',
      success: true,
      data: cookbook
    })
  }
  catch (err) {
    sendResponse({
      req,
      res,
      message: err.message,
      success: false
    })
  }
})
// DELETE /api/v1/cookbooks
router.delete('/', async (req, res, next) => {
  try {
    const cookbook = await deleteCookbook(req.body, req.user as JWTUser)
    sendResponse({
      req,
      res,
      message: 'POST cookbooks',
      success: true
    })
  }
  catch (err) {
    sendResponse({
      req,
      res,
      message: err.message,
      success: false
    })
  }
})

export default router; 