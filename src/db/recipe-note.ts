import mongoose from "mongoose";
import { usersCollectionName } from "./users";

export const recipeNoteCollectionName = "Recipe-Notes";

export type RecipeNoteRecord = {
  recipe: mongoose.Schema.Types.ObjectId;
  note: string;
  createdBy: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

const RecipeNoteSchema = new mongoose.Schema<RecipeNoteRecord>({
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipes",
    required: true,
  },
  note: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: usersCollectionName,
    required: true,
  },
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
});

export const RecipeNoteModel =
  (mongoose.models?.[recipeNoteCollectionName] as mongoose.Model<
    RecipeNoteRecord,
    {},
    {},
    {}
  >) ||
  mongoose.model<RecipeNoteRecord>(recipeNoteCollectionName, RecipeNoteSchema);
