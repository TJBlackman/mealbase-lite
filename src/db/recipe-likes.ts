import { RecipeLikeRecord } from '@src/types';
import mongoose from 'mongoose';

const RecipeLikeSchema = new mongoose.Schema<RecipeLikeRecord>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  recipeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipes',
    required: true,
  },
});

const name = 'Recipe Likes';

export const RecipeLikesModel =
  (mongoose.models[name] as mongoose.Model<RecipeLikeRecord, {}, {}, {}>) ||
  mongoose.model<RecipeLikeRecord>(name, RecipeLikeSchema);
