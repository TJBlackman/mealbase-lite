import { ACTIONS } from './actions'
import { IAppContext } from "../types";
import { defaultContext } from './index'

export const appReducer = (state: IAppContext, action) => {
  const newState = { ...state };
  switch (action.type) {
    case ACTIONS.UPDATE_USER: {
      newState.user = {
        ...newState.user,
        ...action.value
      };
    }
    case ACTIONS.LOG_OUT: {
      newState.user = {
        ...defaultContext.user
      };
    }
    default: {
      console.error('Unknown Action: ' + action.type);
    }
  }
  return newState;
}