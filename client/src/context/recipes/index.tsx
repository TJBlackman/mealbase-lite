import React, { useContext, createContext, useReducer, useEffect } from 'react';
import { IRecipeContext } from './types';
import { reducer } from './reducer';
import { networkRequest } from '../../utils/network-request';
import { makeParamsFromState } from '../../utils/recipe-query-params';

// default context
export const defaultRecipeContext: IRecipeContext = {
  recipes: [],
  totalCount: 0,
  loadingNewRecipes: true,
  displayType: 'cards',
  filters: {
    search: '',
    filter: '',
    sort: '',
    limit: 20,
    page: 1,
    cookbook: '',
  },
  replaceRecipe: () => {},
  setRecipeDisplayType: () => {},
  dismissRecipeFromUI: () => {},
  setFilters: () => {},
};

// create context
const RecipeContext = createContext(defaultRecipeContext);

// provider wrapper
export const RecipeContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, defaultRecipeContext);

  // get new recipes when filters change
  useEffect(() => {
    if (!state.loadingNewRecipes) {
      return;
    }
    const queryParams = makeParamsFromState(state.filters);
    dispatch({ type: 'SET FILTERS', payload: {} });
    networkRequest({
      url: '/api/v1/recipes' + queryParams,
      success: (json) => {
        dispatch({ type: 'SET RECIPES', payload: json.data });
      },
      error: (err) => {
        console.error(err);
        dispatch({
          type: 'SET RECIPES',
          payload: {
            totalCount: 0,
            recipes: [],
          },
        });
        alert(err.message);
      },
    });
  }, [state.loadingNewRecipes]);

  const value: IRecipeContext = {
    ...state,
    replaceRecipe: (payload) => dispatch({ type: 'REPLACE RECIPE', payload }),
    setRecipeDisplayType: (payload) => dispatch({ type: 'SET RECIPE DISPLAY TYPE', payload }),
    dismissRecipeFromUI: (payload) => dispatch({ type: 'DISMISS RECIPE FROM UI', payload }),
    setFilters: (payload) => dispatch({ type: 'SET FILTERS', payload }),
  };

  return <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>;
};

// Hook for using sidemenu context
export const useRecipeContext = () => useContext(RecipeContext);
