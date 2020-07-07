import express from 'express';
const router = express.Router();

import { sendResponse } from '../utils/normalize-response';
import allowLoggedInUsersOnly from '../middleware/auth-users-only';
import { JWTUser } from '../types/type-definitions';
import {
  getRecipes,
  postNewRecipe,
  updateExistingRecipe,
  deleteRecipe,
} from '../services/recipe.service';

// GET /api/v1/recipes
router.get('/', async (req, res, next) => {
  try {
    const recipes = await getRecipes(req.query, req.user as JWTUser);
    sendResponse({
      req,
      res,
      data: recipes,
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

// POST /api/v1/recipes
// Needs recaptcha middleware
router.post('/', allowLoggedInUsersOnly, async (req, res, next) => {
  try {
    const recipe = await postNewRecipe(req.body, req.user as JWTUser);
    sendResponse({
      req,
      res,
      data: recipe,
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

// PUT /api/v1/recipes
router.put('/', allowLoggedInUsersOnly, async (req, res, next) => {
  try {
    const recipe = await updateExistingRecipe(req.body, req.user as JWTUser);
    sendResponse({
      req,
      res,
      message: '',
      success: true,
      data: recipe,
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

// DELETE /api/v1/recipes
router.delete('/', allowLoggedInUsersOnly, async (req, res, next) => {
  try {
    await deleteRecipe(req.body, req.user as JWTUser);
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

// POST /api/v1/recipes/like
router.post('/like', allowLoggedInUsersOnly, async (req, res, next) => {});

export default router;
