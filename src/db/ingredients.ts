import mongoose from "mongoose";
import { usersCollectionName } from "./users";

export const ingredientCollectionName = "Ingredients";

export const IngredientCategories = [
  "Baby",
  "Bakery",
  "Baking",
  "Beer, Wine, and Spirits",
  "Beverages",
  "Cleaning",
  "Dairy",
  "Deli",
  "Floral",
  "Frozen Foods",
  "Health and Beauty",
  "Household",
  "International",
  "Meat and Seafood",
  "Pantry and Dry Goods",
  "Pet",
  "Produce",
] as const;

export type IngredientRecord = {
  value: string;
  category: (typeof IngredientCategories)[number];
  createdAt: Date;
  createdBy: mongoose.Schema.Types.ObjectId;
};

const IngredientSchema = new mongoose.Schema<IngredientRecord>({
  value: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: () => Date.now(),
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: usersCollectionName,
    required: true,
  },
});

export const IngredientModel =
  (mongoose.models?.[ingredientCollectionName] as mongoose.Model<
    IngredientRecord,
    {},
    {},
    {}
  >) ||
  mongoose.model<IngredientRecord>(ingredientCollectionName, IngredientSchema);
