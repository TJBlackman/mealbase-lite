import { IGenericAction, IRecipe, RecursivePartial, IRecipeFilters } from "../../types";

export type RecipeDisplayType = 'cards' | 'list' | 'dense';

// register reducer actions; <type, payload>
export type RecipeAction =
  IGenericAction<'UPDATE RECIPES STATE', RecursivePartial<IRecipeContext>> |
  IGenericAction<'REPLACE RECIPE', IRecipe> |
  IGenericAction<'SET RECIPE DISPLAY TYPE', RecipeDisplayType> |
  IGenericAction<'DISMISS RECIPE FROM UI', IRecipe>;

// modal context
export interface IRecipeContext {
  recipes: IRecipe[];
  totalCount: number;
  loading: boolean;
  filters: IRecipeFilters;
  displayType: RecipeDisplayType;
  updateRecipeContext: (x: RecursivePartial<IRecipeContext>) => void;
  replaceRecipe: (x: IRecipe) => void;
  setRecipeDisplayType: (x: RecipeDisplayType) => void;
  dismissRecipeFromUI: (x: IRecipe) => void;
}