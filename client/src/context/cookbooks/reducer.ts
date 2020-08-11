import { CookbookAction, ICookbookContext } from "./types";
import { getNewState } from "../../utils/copy-state";



// cookbook reducer
export const reducer = (state: ICookbookContext, action: CookbookAction): ICookbookContext => {
  const newState = getNewState(state);
  switch (action.type) {

    case 'ADD COOKBOOK': {
      newState.cookbooks.push({ ...action.payload });
      return newState;
    }

    case 'UPDATE COOKBOOK': {
      newState.cookbooks = newState.cookbooks.map(cb => {
        return cb._id === action.payload._id
          ? { ...action.payload }
          : cb;
      });
      return newState;
    }

    case 'REMOVE COOKBOOK': {
      newState.cookbooks = newState.cookbooks.filter(cb => cb._id !== action.payload.cookbookId);
      return newState;
    }

    case 'ADD MANY COOKBOOKS': {
      const newCookbookIds = action.payload.map(cb => cb._id);
      const filteredCookbooks = newState.cookbooks.filter(cb => !newCookbookIds.includes(cb._id));
      newState.cookbooks = [
        ...filteredCookbooks,
        ...action.payload
      ];
      return newState;
    }

    default: {
      console.error(`Unknown cookbook reducer type:\n${JSON.stringify(action, null, 4)}`);
      return state;
    }
  }
};