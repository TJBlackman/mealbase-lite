import mongoose from 'mongoose';
import { RECIPE_LIKES_RECORD, USER_RECORD, RECIPE_RECORD } from './types';

const RecipeLikesSchema = new mongoose.Schema({
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
  }
});

const RecipeLikeModel = mongoose.model(RECIPE_LIKES_RECORD, RecipeLikesSchema);

export default RecipeLikeModel;
