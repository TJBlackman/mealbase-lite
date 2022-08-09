import { Recipe } from '@src/types';
import mongoose from 'mongoose';
import { usersCollectionName } from './users';

const RecipeSchema = new mongoose.Schema<Recipe>({
  createdAt: {
    type: Date,
    required: true,
    default: () => Date.now(),
  },
  updatedAt: {
    type: Date,
    required: true,
    default: () => Date.now(),
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
    unique: true,
  },
  siteName: {
    type: String,
    required: true,
  },
  addedByUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: usersCollectionName,
    required: true,
  },
  likes: {
    type: Number,
    required: true,
    default: 0,
  },
  deleted: {
    type: Boolean,
    required: true,
    default: false,
  },
  hash: {
    type: String,
    required: false,
    default: '',
  },
});

// allows string seach on title, siteName fields
RecipeSchema.index({ title: 1 });
RecipeSchema.index({ siteName: 1 });

export const recipeCollectionName = 'Recipes';

export const RecipeModel =
  (mongoose.models[recipeCollectionName] as mongoose.Model<
    Recipe,
    {},
    {},
    {}
  >) || mongoose.model<Recipe>(recipeCollectionName, RecipeSchema);
