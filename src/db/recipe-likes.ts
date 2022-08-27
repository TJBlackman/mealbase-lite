import mongoose from "mongoose";

import { usersCollectionName } from "./users";
import { recipeCollectionName } from "./recipes";

const RecipeLikeSchema = new mongoose.Schema<RecipeLikeRecord>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: usersCollectionName,
    required: true,
  },
  recipeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: recipeCollectionName,
    required: true,
  },
});

const recipeLikesCollectionName = "Recipe Likes";

export const RecipeLikesModel =
  (mongoose.models?.[recipeLikesCollectionName] as mongoose.Model<
    RecipeLikeRecord,
    {},
    {},
    {}
  >) ||
  mongoose.model<RecipeLikeRecord>(recipeLikesCollectionName, RecipeLikeSchema);

type RecipeLikeRecord = {
  userId: mongoose.Schema.Types.ObjectId;
  recipeId: mongoose.Schema.Types.ObjectId;
};
