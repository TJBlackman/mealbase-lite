import { ACTIONS } from './actions'
import { IAppContext, IAction, IRecipe, ModalTypes } from "../types";
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
      newState.recipes.browse = newState.recipes.browse.map(recipe => ({
        ...recipe,
        isLiked: false
      }));
      break;
    }
    case ACTIONS.UPDATE_RECIPES_STATE: {
      newState.recipes = {
        ...newState.recipes,
        ...action.payload
      };
      if (action.payload.filters) {
        newState.recipes.filters = {
          ...state.recipes.filters,
          ...action.payload.filters
        }
      }
      break;
    }
    case ACTIONS.REPLACE_RECIPE: {
      newState.recipes.browse = newState.recipes.browse.map((recipe: IRecipe) => {
        if (recipe._id === action.payload._id) {
          return action.payload
        } else {
          return recipe;
        }
      })
      break;
    }
    case ACTIONS.SET_MODAL: {
      if (action.payload.type === ModalTypes.CLEAR_MODAL) {
        newState.modal = { ...defaultAppContext.modal };
      } else {
        newState.modal = { ...action.payload };
      }
      break;
    }
    default: {
      console.error('Unknown Action: ' + action.type);
    }
  }
  return newState;
}