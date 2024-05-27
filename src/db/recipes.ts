import mongoose from "mongoose";
import { usersCollectionName } from "./users";
import { ingredientCollectionName } from "./ingredients";
import { recipeNoteCollectionName } from "./recipe-note";

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
  images: {
    type: [String],
    required: true,
  },
  url: {
    type: String,
    required: false,
    unique: true,
  },
  siteName: {
    type: String,
    required: false,
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
    default: "",
  },
  ingredients: {
    type: [
      {
        sectionTitle: String,
        sectionIngredients: [
          {
            ingredient: {
              type: mongoose.Schema.Types.ObjectId,
              ref: ingredientCollectionName,
            },
            quantity: String,
          },
        ],
      },
    ],
    required: false,
  },
  instructions: {
    type: [
      {
        sectionTitle: String,
        sectionInstructions: [String],
      },
    ],
    required: false,
  },
  notes: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: recipeNoteCollectionName,
  },
  type: {
    type: String,
    required: true,
  },
});

// allows string seach on title, siteName fields
RecipeSchema.index({ title: 1 });
RecipeSchema.index({ siteName: 1 });

export const recipeCollectionName = "Recipes";

export const RecipeModel =
  (mongoose.models?.[recipeCollectionName] as mongoose.Model<
    Recipe,
    {},
    {},
    {}
  >) || mongoose.model<Recipe>(recipeCollectionName, RecipeSchema);

export interface Recipe {
  createdAt: Date;
  updatedAt: Date;
  title: string;
  description: string;
  images: string[];
  url?: string;
  siteName?: string;
  likes: number;
  deleted: boolean;
  addedByUser: mongoose.Schema.Types.ObjectId;
  hash?: string;
  ingredients?: {
    sectionTitle: string;
    sectionIngredients: {
      ingredient: mongoose.Schema.Types.ObjectId;
      quantity: string;
    }[];
  }[];
  instructions?: {
    sectionTitle: string;
    sectionInstructions: string[];
  }[];
  notes?: mongoose.Schema.Types.ObjectId;
  type: "url" | "image" | "full-recipe";
}
