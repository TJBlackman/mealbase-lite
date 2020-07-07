import mongoose from 'mongoose';
import { RECIPE_MODEL } from './types';

const RecipeSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: true,
    trim: true,
  },
  url: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  siteName: {
    type: String,
    required: true,
    trim: true,
  },
  deleted: {
    type: Boolean,
    required: true,
    default: false,
  },
});

// allows string seach on title, siteName fields
RecipeSchema.index('title');
RecipeSchema.index('siteName');

const RecipeModel = mongoose.model(RECIPE_MODEL, RecipeSchema);

export default RecipeModel;
