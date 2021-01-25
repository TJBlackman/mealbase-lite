import React, { useContext, createContext, useReducer } from 'react';

import { reducer } from './reducer';
import { IMealPlan } from '../../types';

export interface IMealplanContext {
  mealplans: IMealPlan[];
  loading: boolean;
  addMealPlan: (mealplan: IMealPlan) => void;
  updateMealPlan: (mealplan: IMealPlan) => void;
  removeMealPlan: (mealplanId: IMealPlan) => void;
  addManyMealPlans: (mealplans: IMealPlan[]) => void;
  addRecipeToMealPlan: (arg: { recipeId: string; mealplanId: string }) => void;
  loadMealPlans: () => void;
}

// default context
const defaultContext: IMealplanContext = {
  mealplans: [],
  loading: false,
  addMealPlan: () => {},
  updateMealPlan: () => {},
  removeMealPlan: () => {},
  addManyMealPlans: () => {},
  addRecipeToMealPlan: () => {},
  loadMealPlans: () => {},
};

// create context
const MealPlanContext = createContext(defaultContext);

// provider wrapper
export const MealPlanContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, defaultContext);

  const value: IMealplanContext = {
    ...state,
    addMealPlan: (payload) => dispatch({ type: 'ADD MEALPLAN', payload }),
    updateMealPlan: (payload) => dispatch({ type: 'REMOVE MEALPLAN', payload }),
    removeMealPlan: (payload) => dispatch({ type: 'UPDATE MEALPLAN', payload }),
    addManyMealPlans: (payload) => dispatch({ type: 'ADD MANY MEALPLANS', payload }),
    addRecipeToMealPlan: (payload) => dispatch({ type: 'ADD RECIPE TO MEALPLAN', payload }),
    loadMealPlans: () => dispatch({ type: 'LOAD MEALPLANS' }),
  };

  return <MealPlanContext.Provider value={value}> {children} </MealPlanContext.Provider>;
};

export const useMealPlanContext = () => useContext(MealPlanContext);
