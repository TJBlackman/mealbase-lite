import React, { createContext, useReducer, useEffect } from 'react';
import { appReducer } from './reducer';
import { ACTIONS as A } from './actions';
import { IContextValue, IAppContext, IUserData } from '../types';

// app default state
export const defaultAppContext: IAppContext = {
  user: {
    _id: '',
    email: '',
    roles: [],
  },
  sidemenu: {
    visible: false,
  },
  browse: {
    recipes: [],
    loading: false,
    filters: {
      search: '',
      filter: 'all',
      sort: 'most likes',
      limit: 20,
      page: 1,
    },
  },
};

// use state from sessionStorage or default
const initialAppState: IAppContext = (() => {
  const state = sessionStorage.getItem(process.env.APP_SESSION_STORAGE_KEY);
  return !!state ? JSON.parse(state) : defaultAppContext;
})();

// reference to context itself
export const AppContext = createContext((initialAppState as unknown) as IContextValue);

// component
export const GlobalContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialAppState);

  useEffect(() => {
    // save state in sessionStorage
    const strState = JSON.stringify(state);
    sessionStorage.setItem(process.env.APP_SESSION_STORAGE_KEY, strState);
  }, [state]);

  const contextValue: IContextValue = {
    globalState: state,
    updateUserData: (payload) => dispatch({ type: A.UPDATE_USER, payload }),
    toggleSideMenu: () => dispatch({ type: A.TOGGLE_SIDEMENU }),
    logout: () => dispatch({ type: A.LOG_OUT }),
    updateBrowsePage: (payload) => dispatch({ type: A.UPDATE_BROWSE_PAGE, payload }),
  };

  console.log('NEW Global Context - ', new Date().toLocaleTimeString());
  console.log(state);

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};
