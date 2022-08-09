import mongoose from "mongoose";

const FailedRecipeSchema = new mongoose.Schema<FailedRecipe>({
  url: {
    type: String,
    required: true,
  },
  addedByUser: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
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

const failedRecipeCollectionName = "Failed_Recipes";

export const FailedRecipeModel =
  (mongoose.models[failedRecipeCollectionName] as mongoose.Model<
    FailedRecipe,
    {},
    {},
    {}
  >) || mongoose.model(failedRecipeCollectionName, FailedRecipeSchema);

type FailedRecipe = {
  url: string;
  addedByUser: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  resolvedDate: Date;
  resolved: boolean;
};
