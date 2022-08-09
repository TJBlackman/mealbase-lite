import mongoose from "mongoose";
import { InvitationCollectionName } from "./invites";
import { usersCollectionName } from "./users";
import { recipeCollectionName } from "./recipes";

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
    ref: usersCollectionName,
    required: true,
  },
  members: {
    required: true,
    default: () => [],
    type: [
      {
        member: {
          type: mongoose.Schema.Types.ObjectId,
          ref: usersCollectionName,
        },
        permissions: {
          type: [String],
          required: true,
        },
      },
    ],
  },
  invites: {
    required: true,
    default: () => [],
    type: [
      {
        invitee: {
          type: mongoose.Schema.Types.ObjectId,
          ref: InvitationCollectionName,
        },
        permissions: {
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
          ref: recipeCollectionName,
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

export const MealPlansCollectionName = "mealplans";

export const MealPlansModel =
  (mongoose.models?.[MealPlansCollectionName] as mongoose.Model<
    MealPlan,
    {},
    {},
    {}
  >) || mongoose.model<MealPlan>(MealPlansCollectionName, MealPlanSchema);

export enum MealPlanPermissions {
  CompleteRecipes = "CompleteRecipes",
  EditRecipes = "EditRecipes",
  EditMembers = "EditMembers",
}

export interface MealPlan {
  title: string;
  createdAt: Date;
  updatedAt: Date;
  recipes: {
    recipe: mongoose.Schema.Types.ObjectId;
    isCooked: boolean;
  }[];
  members: {
    member: mongoose.Schema.Types.ObjectId;
    permissions: MealPlanPermissions[];
  }[];
  invites: {
    invitee: mongoose.Schema.Types.ObjectId;
    permissions: MealPlanPermissions[];
  }[];
  owner: mongoose.Schema.Types.ObjectId;
}
