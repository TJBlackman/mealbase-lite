import { IRecipeContext, RecipeAction } from "./types";
import { getNewState } from "../../utils/copy-state";

export const reducer = (state: IRecipeContext, action: RecipeAction): IRecipeContext => {
  const newState: IRecipeContext = getNewState(state);
  switch (action.type) {
    case 'UPDATE RECIPES STATE': {

      if (action.payload.filters) {
        newState.recipes.filters = {
          ...state.recipes.filters,
          ...action.payload.filters
        }
      }
    }
    default: {
      console.error(`Unknown recipe action type:\n${JSON.stringify(action, null, 4)}`);
      return state;
    }
  }
}; 