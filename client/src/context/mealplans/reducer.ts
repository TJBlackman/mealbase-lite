import { IMealplanContext } from "./index";
import { getNewState } from "../../utils/copy-state";
import { IMealPlan } from "../../types";

export type Action =
  | { type: 'ADD MEALPLAN', payload: IMealPlan; }
  | { type: 'UPDATE MEALPLAN', payload: IMealPlan; }
  | { type: 'REMOVE MEALPLAN', payload: IMealPlan; }
  | { type: 'ADD RECIPE TO MEALPLAN', payload: { recipeId: string; mealplanId: string; }; }
  | { type: 'ADD MANY MEALPLANS', payload: IMealPlan[]; }
  | { type: 'LOAD MEALPLANS'; }

// cookbook reducer
export const reducer = (state: IMealplanContext, action: Action): IMealplanContext => {
  const newState = getNewState(state);
  switch (action.type) {

    case 'ADD MEALPLAN': {
      newState.mealplans.push({ ...action.payload });
      newState.mealplans.sort((a, b) => a.createdAt > b.createdAt ? 1 : -1);
      newState.loading = false;
      return newState;
    }

    case 'UPDATE MEALPLAN': {
      newState.mealplans = newState.mealplans.map(mealplan => {
        return mealplan._id === action.payload._id
          ? { ...action.payload }
          : mealplan;
      });
      newState.mealplans.sort((a, b) => a.createdAt > b.createdAt ? 1 : -1);
      newState.loading = false;
      return newState;
    }

    case 'REMOVE MEALPLAN': {
      newState.mealplans = newState.mealplans.filter(({ _id }) => _id !== action.payload._id);
      newState.loading = false;
      return newState;
    }

    case 'ADD MANY MEALPLANS': {
      const newCookbookIds = action.payload.map(cb => cb._id);
      const filteredCookbooks = newState.mealplans.filter(cb => !newCookbookIds.includes(cb._id));
      newState.mealplans = [
        ...filteredCookbooks,
        ...action.payload
      ];
      newState.mealplans.sort((a, b) => a.createdAt > b.createdAt ? 1 : -1);
      newState.loading = false;
      return newState;
    }

    case 'ADD RECIPE TO MEALPLAN': {
      const mealplans = newState.mealplans.find(i => i._id === action.payload.mealplanId);
      mealplans.recipes.push(action.payload.recipeId);
      newState.loading = false;
      return newState;
    }

    case 'LOAD MEALPLANS': {
      newState.loading = true;
      return newState;
    }

    default: {
      console.error(`Unknown cookbook reducer type:\n${JSON.stringify(action, null, 4)}`);
      return state;
    }
  }
};