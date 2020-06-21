import React, { createContext, useReducer, useEffect } from 'react';
import { appReducer } from './reducer';
import { ACTIONS } from './actions';
import { IContextValue, IAppContext } from '../types';

export const defaultContext: IAppContext = {
  user: {
    email: '',
    authenticated: false,
  },
};

// reference to context itself
export const AppContext = createContext(defaultContext as IContextValue);

export const GlobalContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, defaultContext);
  const value: IContextValue = {
    state: state,
    updateUserData: (value) =>
      dispatch({
        action: ACTIONS.UPDATE_USER,
        value,
      }),
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
