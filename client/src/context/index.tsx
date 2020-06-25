import React, { createContext, useReducer, useEffect } from 'react';
import { appReducer } from './reducer';
import { ACTIONS } from './actions';
import { IContextValue, IAppContext, IUserData } from '../types';

export const defaultAppContext: IAppContext = {
  user: {
    _id: '',
    email: '',
    roles: [],
  },
};

// reference to context itself
export const AppContext = createContext(defaultAppContext as IContextValue);

export const GlobalContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, defaultAppContext);
  const contextValue: IContextValue = {
    state: state,
    updateUserData: (value: Partial<IUserData>) =>
      dispatch({
        type: ACTIONS.UPDATE_USER,
        value,
      }),
  };

  // console.log('New Global App Context:');
  // console.log(JSON.stringify(state, null, 2));

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};
