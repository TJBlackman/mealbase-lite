import { ACTIONS } from './actions'
import { IAppContext, IAction, IRecipe } from "../types";
import { defaultAppContext } from './index'
import { getNewState } from "../utils/copy-state";

export const appReducer = (state: IAppContext, action: IAction) => {
  // generate new state
  const newState = getNewState(state);
  switch (action.type) {
    case ACTIONS.UPDATE_USER: {
      newState.user = {
        ...newState.user,
        ...action.payload
      };
      break;
    }
    case ACTIONS.TOGGLE_SIDEMENU: {
      newState.sidemenu.visible = !newState.sidemenu.visible;
      break;
    }
    case ACTIONS.LOG_OUT: {
      newState.user = {
        ...defaultAppContext.user
      };
      newState.browse.recipes = newState.browse.recipes.map(recipe => ({
        ...recipe,
        isLiked: false
      }));
      break;
    }
    case ACTIONS.UPDATE_BROWSE_PAGE: {
      newState.browse = {
        ...newState.browse,
        ...action.payload
      };
      if (action.payload.filters) {
        newState.browse.filters = {
          ...newState.browse.filters,
          ...action.payload.filters
        }
      }
      break;
    }
    case ACTIONS.REPLACE_RECIPE: {
      newState.browse.recipes = newState.browse.recipes.map((recipe: IRecipe) => {
        if (recipe._id === action.payload._id) {
          return action.payload
        } else {
          return recipe;
        }
      })
      break;
    }
    default: {
      console.error('Unknown Action: ' + action.type);
    }
  }
  return newState;
}