import mongoose from 'mongoose';
import { RECIPE_REPORT, RECIPE_RECORD, USER_RECORD } from "./types";

const RecipeReportSchema = new mongoose.Schema({
  recipeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: RECIPE_RECORD,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: USER_RECORD,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['unresolved', 'pending', 'resolved'],
    default: 'unresolved'
  }
});

const RecipeReportModel = mongoose.model(RECIPE_REPORT, RecipeReportSchema);

export default RecipeReportModel;