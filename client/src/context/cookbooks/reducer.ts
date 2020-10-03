import { CookbookAction, ICookbookContext } from "./types";
import { getNewState } from "../../utils/copy-state";
import { ICookbookRecord } from "../../types";

const sortAlphabeticByTitle = (cookbooks: ICookbookRecord[]) => {
  // sorts in place... idk
  cookbooks.sort((a, b) => {
    return a.title.toLocaleLowerCase().localeCompare(b.title.toLocaleLowerCase());
  });
}

// cookbook reducer
export const reducer = (state: ICookbookContext, action: CookbookAction): ICookbookContext => {
  const newState = getNewState(state);
  switch (action.type) {

    case 'ADD COOKBOOK': {
      newState.cookbooks.push({ ...action.payload });
      sortAlphabeticByTitle(newState.cookbooks);
      return newState;
    }

    case 'UPDATE COOKBOOK': {
      newState.cookbooks = newState.cookbooks.map(cb => {
        return cb._id === action.payload._id
          ? { ...action.payload }
          : cb;
      });
      sortAlphabeticByTitle(newState.cookbooks);
      return newState;
    }

    case 'REMOVE COOKBOOK': {
      newState.cookbooks = newState.cookbooks.filter(cb => cb._id !== action.payload._id);
      return newState;
    }

    case 'ADD MANY COOKBOOKS': {
      const newCookbookIds = action.payload.map(cb => cb._id);
      const filteredCookbooks = newState.cookbooks.filter(cb => !newCookbookIds.includes(cb._id));
      newState.cookbooks = [
        ...filteredCookbooks,
        ...action.payload
      ];
      sortAlphabeticByTitle(newState.cookbooks);
      return newState;
    }

    case 'ADD RECIPE TO COOKBOOK': {
      const cookbook = newState.cookbooks.find(i => i._id === action.payload.cookbookId);
      cookbook.recipes.push(action.payload.recipeId);
      return newState;
    }

    default: {
      console.error(`Unknown cookbook reducer type:\n${JSON.stringify(action, null, 4)}`);
      return state;
    }
  }
};