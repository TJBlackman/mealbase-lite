import { MealPlan } from '@src/types';
import mongoose from 'mongoose';

const MealPlanSchema = new mongoose.Schema<MealPlan>({
  title: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: () => new Date(),
  },
  updatedAt: {
    type: Date,
    required: true,
    default: () => new Date(),
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  members: {
    required: true,
    default: () => [],
    type: [
      {
        member: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Users',
        },
        permission: {
          type: [String],
          required: true,
        },
      },
    ],
  },
  recipes: {
    required: true,
    default: () => [],
    type: [
      {
        recipe: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'recipes',
          required: true,
        },
        isCooked: {
          type: Boolean,
          required: true,
          default: false,
        },
      },
    ],
  },
});

export const MealPlansModel =
  (mongoose.models.MealPlans as mongoose.Model<MealPlan, {}, {}, {}>) ||
  mongoose.model<MealPlan>('MealPlans', MealPlanSchema);
