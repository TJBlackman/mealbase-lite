import { IGenericAction, IRecipe, RecursivePartial, IRecipeFilters } from "../../types";

export type RecipeDisplayType = 'cards' | 'list' | 'dense';

// register reducer actions; <type, payload>
export type RecipeAction =
  IGenericAction<'SET RECIPES', {
    totalCount: number;
    recipes: IRecipe[];
  }> |
  IGenericAction<'REQUEST NEW RECIPES'> |
  IGenericAction<'REPLACE RECIPE', IRecipe> |
  IGenericAction<'SET RECIPE DISPLAY TYPE', RecipeDisplayType> |
  IGenericAction<'DISMISS RECIPE FROM UI', IRecipe> |
  IGenericAction<'SET FILTERS', Partial<IRecipeFilters>>;

// modal context
export interface IRecipeContext {
  recipes: IRecipe[];
  totalCount: number;
  loadingNewRecipes: boolean;
  filters: IRecipeFilters;
  displayType: RecipeDisplayType;
  replaceRecipe: (x: IRecipe) => void;
  setRecipeDisplayType: (x: RecipeDisplayType) => void;
  dismissRecipeFromUI: (x: IRecipe) => void;
  setFilters: (x: Partial<IRecipeFilters>) => void;
}