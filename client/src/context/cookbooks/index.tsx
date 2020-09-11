import React, { useContext, createContext, useReducer } from 'react';
import { ICookbookContext } from './types';
import { reducer } from './reducer';

// default context
const defaultContext: ICookbookContext = {
  cookbooks: [],
  addCookbook: () => {},
  removeCookbook: () => {},
  updateCookbook: () => {},
  addManyCookbooks: () => {},
  addRecipeToCookbook: () => {},
};

// create context
const CookbookContext = createContext(defaultContext);

// provider wrapper
export const CookbookContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, defaultContext);

  const value: ICookbookContext = {
    cookbooks: state.cookbooks,
    addCookbook: (payload) => dispatch({ type: 'ADD COOKBOOK', payload }),
    removeCookbook: (payload) => dispatch({ type: 'REMOVE COOKBOOK', payload }),
    updateCookbook: (payload) => dispatch({ type: 'UPDATE COOKBOOK', payload }),
    addManyCookbooks: (payload) => dispatch({ type: 'ADD MANY COOKBOOKS', payload }),
    addRecipeToCookbook: (payload) => dispatch({ type: 'ADD RECIPE TO COOKBOOK', payload }),
  };

  return <CookbookContext.Provider value={value}>{children}</CookbookContext.Provider>;
};

// Hook for using cookbook context
export const useCookbookContext = () => useContext(CookbookContext);
