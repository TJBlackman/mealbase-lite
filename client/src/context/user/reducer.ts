import { UserAction, IUserContext } from './types';
import { getNewState } from "../../utils/copy-state";
import { defaultUserContext } from './index'

export const reducer = (state: IUserContext, action: UserAction) => {
  const newState = getNewState(state);
  switch (action.type) {
    case 'UPDATE USER DATA': {
      newState.user = {
        ...newState.user,
        ...action.payload
      };
      return newState;
    }
    case 'LOG OUT': {
      return defaultUserContext;
    }
    default: {
      console.error(`Unknown user context action type:\n${JSON.stringify(action, null, 4)}`);
      return state;
    }
  }
}