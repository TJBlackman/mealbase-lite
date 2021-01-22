import React, { useContext, createContext, useReducer } from 'react';
import { IUserContext } from './types';
import { reducer } from './reducer';

// default context
export const defaultUserContext: IUserContext = {
  user: {
    _id: '',
    email: '',
    roles: [],
    createdAt: '',
    updatedAt: '',
    lastActiveDate: '',
  },
  updateUserData: () => {},
  logout: () => {},
};

// create context
const UserContext = createContext(defaultUserContext);

// provider wrapper
export const UserContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, defaultUserContext);

  const value: IUserContext = {
    user: state.user,
    updateUserData: (payload) => dispatch({ type: 'UPDATE USER DATA', payload }),
    logout: () => dispatch({ type: 'LOG OUT' }),
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Hook for using user context
export const useUserContext = () => useContext(UserContext);
