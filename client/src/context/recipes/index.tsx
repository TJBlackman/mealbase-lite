import React, { useContext, createContext, useReducer } from 'react';
import { IRecipeContext } from './types';
import { reducer } from './reducer';

// default context
export const defaultRecipeContext: IRecipeContext = {
  recipes: [],
  totalCount: 0,
  loading: false,
  filters: {
    search: '',
    filter: '',
    sort: '',
    limit: 20,
    page: 1,
    cookbook: '',
  },
  displayType: 'cards',
  updateRecipeContext: () => {},
  replaceRecipe: () => {},
  setRecipeDisplayType: () => {},
  dismissRecipeFromUI: () => {},
};

// create context
const RecipeContext = createContext(defaultRecipeContext);

// provider wrapper
export const RecipeContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, defaultRecipeContext);

  const value: IRecipeContext = {
    ...state,
    updateRecipeContext: (payload) => dispatch({ type: 'UPDATE RECIPES STATE', payload }),
    replaceRecipe: (payload) => dispatch({ type: 'REPLACE RECIPE', payload }),
    setRecipeDisplayType: (payload) => dispatch({ type: 'SET RECIPE DISPLAY TYPE', payload }),
    dismissRecipeFromUI: (payload) => dispatch({ type: 'DISMISS RECIPE FROM UI', payload }),
  };

  return <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>;
};

// Hook for using sidemenu context
export const useRecipeContext = () => useContext(RecipeContext);
