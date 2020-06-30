import { IRecipe } from '../../types'

export enum ActionTypes {
  SET_LOADING
};

export interface IBrowseRecipeState {
  loading: boolean;
  recipes: IRecipe[];
}