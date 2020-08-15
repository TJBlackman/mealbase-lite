import { IGenericAction, IRecipe, RecursivePartial } from "../../types";

export type RecipeDisplayType = 'cards' | 'list' | 'dense';

// register reducer actions; <type, payload>
export type RecipeAction =
  IGenericAction<'UPDATE RECIPES STATE', RecursivePartial<IRecipeContext>> |
  IGenericAction<'REPLACE RECIPE', IRecipe> |
  IGenericAction<'SET RECIPE DISPLAY TYPE', RecipeDisplayType>;

// modal context
export interface IRecipeContext {
  recipes: IRecipe[];
  totalCount: number;
  loading: boolean;
  filters: {
    search: string;
    filter: 'x' | 'liked';
    sort: 'most liked' | 'newest' | 'oldest';
    limit: number;
    page: number;
  };
  displayType: RecipeDisplayType;
  updateRecipeContext: (x: RecursivePartial<IRecipeContext>) => void;
  replaceRecipe: (x: IRecipe) => void;
  setRecipeDisplayType: (x: RecipeDisplayType) => void;
}