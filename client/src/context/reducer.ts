import { ACTIONS } from './actions'
import { IAppContext, IAction } from "../types";
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
      break;
    }
    case ACTIONS.UPDATE_BROWSE_FILTERS: {
      newState.browse.filters = {
        ...newState.browse.filters,
        ...action.payload
      }
      break;
    }
    default: {
      console.error('Unknown Action: ' + action.type);
    }
  }
  return newState;
}