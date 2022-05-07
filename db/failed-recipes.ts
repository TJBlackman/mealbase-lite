import { FailedRecipe } from "@src/types";
import mongoose from "mongoose";

const FailedRecipeSchema = new mongoose.Schema<FailedRecipe>({
  url: {
    type: String,
    required: true,
  },
  addedByUser: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: () => Date.now(),
  },
  resolved: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const collectionName = "Failed_Recipes";

export const FailedRecipeModel =
  (mongoose.models[collectionName] as mongoose.Model<
    FailedRecipe,
    {},
    {},
    {}
  >) || mongoose.model(collectionName, FailedRecipeSchema);
