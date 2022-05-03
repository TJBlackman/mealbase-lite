import mongoose from "mongoose";
import { RECIPE_RECORD } from "./types";

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
  isLiked: {
    type: Boolean,
    required: true,
    default: false,
  },
});

// allows string seach on title, siteName fields
RecipeSchema.index({ title: 1, siteName: 1 });

const RecipeModel = mongoose.model(RECIPE_RECORD, RecipeSchema);

export default RecipeModel;
