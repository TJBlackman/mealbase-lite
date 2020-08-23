import express from 'express';
import { sendResponse } from '../utils/normalize-response';
import { getCookbooks, createNewCookbook, editCookbook, deleteCookbook, addRecipeToCookbook, removeRecipeFromCookbook } from '../services/cookbook.service';
import { JWTUser } from '../types/type-definitions';
import allowLoggedInUsersOnly from '../middleware/auth-users-only';
const router = express.Router();

// GET /api/v1/cookbooks
router.get('/', allowLoggedInUsersOnly, async (req, res, next) => {
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
router.post('/', allowLoggedInUsersOnly, async (req, res, next) => {
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
router.put('/', allowLoggedInUsersOnly, async (req, res, next) => {
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
router.delete('/', allowLoggedInUsersOnly, async (req, res, next) => {
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
});
// POST /api/v1/cookbooks/add-recipe
router.post('/add-recipe', allowLoggedInUsersOnly, async (req, res, next) => {
  try {
    await addRecipeToCookbook(req.body, req.user as JWTUser);
    sendResponse({
      req,
      res,
      message: '',
      success: true,
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
});
// POST /api/v1/cookbooks/remove-recipe
router.post('/remove-recipe', allowLoggedInUsersOnly, async (req, res, next) => {
  try {
    await removeRecipeFromCookbook(req.body, req.user as JWTUser);
    sendResponse({
      req,
      res,
      message: '',
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