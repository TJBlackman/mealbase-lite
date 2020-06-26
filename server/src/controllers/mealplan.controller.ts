import express from 'express';
import { sendResponse } from '../utils/normalize-response';
import { getMealPlans, createNewMealPlan, editMealPlans, deleteMealPlans } from '../services/mealplan.service';
import { JWTUser } from '../types/type-definitions';
const router = express.Router();

// GET /api/v1/mealplans
router.get('/', async (req, res, next) => {
  try {
    const mealplans = await getMealPlans(req.query, req.user as JWTUser);
    sendResponse({
      req,
      res,
      message: '',
      success: true,
      data: mealplans
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
// POST /api/v1/mealplans
router.post('/', async (req, res, next) => {
  try {
    const mealplan = await createNewMealPlan(req.body, req.user as JWTUser)
    sendResponse({
      req,
      res,
      message: '',
      success: true,
      data: mealplan
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
// PUT /api/v1/mealplans
router.put('/', async (req, res, next) => {
  try {
    const mealplan = await editMealPlans(req.body, req.user as JWTUser);
    sendResponse({
      req,
      res,
      message: '',
      success: true,
      data: mealplan
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
// DELETE /api/v1/mealplans
router.delete('/', async (req, res, next) => {
  try {
    const mealplan = await deleteMealPlans(req.body, req.user as JWTUser)
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