import { ACTIONS } from './actions'
import { IAppContext } from "../types";
import { defaultAppContext } from './index'

const getNewState = (state: IAppContext): IAppContext => {
  return {
    ...state,
    user: { ...state.user }
  }
}

export const appReducer = (state: IAppContext, action) => {
  // generate new state
  const newState = getNewState(state);
  switch (action.type) {
    case ACTIONS.UPDATE_USER: {
      newState.user = {
        ...newState.user,
        ...action.value
      };
      return newState;
    }
    case ACTIONS.LOG_OUT: {
      newState.user = {
        ...defaultAppContext.user
      };
      return newState;
    }
    default: {
      console.error('Unknown Action: ' + action.type);
      return state;
    }
  }
}