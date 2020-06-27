export enum BrowseRecipeActions {
  LOADING_TRUE,
  LOADING_FALSE,
  SET_RECIPES
}

export interface IBrowseRecipeState {
  loading: boolean;
}