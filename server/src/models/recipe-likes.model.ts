import mongoose from 'mongoose';
import { RECIPE_LIKES_MODEL } from './types';

const RecipeLikesSchema = new mongoose.Schema({
  recipeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true,
  },
});

const RecipeLikeModel = mongoose.model(RECIPE_LIKES_MODEL, RecipeLikesSchema);

export default RecipeLikeModel;
