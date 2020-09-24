import { IRecipeContext, RecipeAction } from "./types";
import { getNewState } from "../../utils/copy-state";
import { IRecipe } from "../../types";

export const reducer = (state: IRecipeContext, action: RecipeAction): IRecipeContext => {
  const newState: IRecipeContext = getNewState(state);
  switch (action.type) {
    case 'UPDATE RECIPES STATE': {
      const x = {
        ...newState,
        ...action.payload,
        filters: {
          ...newState.filters,
          ...action.payload.filters
        }
      };
      return x as IRecipeContext;
    }
    case 'REPLACE RECIPE': {
      newState.recipes = newState.recipes.map((recipe: IRecipe) => {
        return recipe._id === action.payload._id ? action.payload : recipe;
      });
      return newState;
    }
    case 'SET RECIPE DISPLAY TYPE': {
      newState.displayType = action.payload;
      return newState;
    }
    case 'DISMISS RECIPE FROM UI': {
      newState.recipes = newState.recipes.filter(r => r._id !== action.payload._id);
      return newState;
    }
    default: {
      console.error(`Unknown recipe action type:\n${JSON.stringify(action, null, 4)}`);
      return state;
    }
  }
}; 