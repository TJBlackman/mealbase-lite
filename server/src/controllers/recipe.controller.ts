import express from "express";
const router = express.Router();

import { sendResponse } from "../utils/normalize-response";
import allowLoggedInUsersOnly from "../middleware/auth-users-only";
import { JWTUser } from "../types/type-definitions";
import {
  getRecipesService,
  newRecipeService,
  editRecipeService,
  deleteRecipeService,
  likeRecipeService,
  unLikedRecipeService,
} from "../services/recipe.service";
import { userHasRole } from "../utils/validators";
import FailedRecipeSchema from "../models/failed-recipes.model";

// GET /api/v1/recipes
router.get("/", async (req, res, next) => {
  try {
    const recipes = await getRecipesService(req.query, req.user as JWTUser);
    sendResponse({
      req,
      res,
      data: recipes,
      message: "",
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
router.post("/", allowLoggedInUsersOnly, async (req, res, next) => {
  try {
    const recipe = await newRecipeService(req.body, req.user as JWTUser);
    sendResponse({
      req,
      res,
      data: recipe,
      message: "",
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
router.put("/", allowLoggedInUsersOnly, async (req, res, next) => {
  try {
    const recipe = await editRecipeService(req.body, req.user as JWTUser);
    sendResponse({
      req,
      res,
      message: "",
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
router.delete("/", allowLoggedInUsersOnly, async (req, res, next) => {
  try {
    await deleteRecipeService(req.body, req.user as JWTUser);
    sendResponse({
      req,
      res,
      message: "",
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
router.post("/like", allowLoggedInUsersOnly, async (req, res, next) => {
  try {
    const results = await likeRecipeService(req.body, req.user as JWTUser);
    sendResponse({
      req,
      res,
      data: results,
      message: "",
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

// POST /api/v1/recipes/unlike
router.post("/unlike", allowLoggedInUsersOnly, async (req, res, next) => {
  try {
    const result = await unLikedRecipeService(req.body, req.user as JWTUser);
    sendResponse({
      req,
      res,
      data: result,
      message: "",
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

router.get("/failed-recipes", allowLoggedInUsersOnly, async (req, res) => {
  try {
    if (!userHasRole("admin", req.user as JWTUser)) {
      throw Error("Only admins can access this feature.");
    }
    const recipes = await FailedRecipeSchema.find({});
    sendResponse({
      req,
      res,
      data: recipes,
      message: "",
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
