import React, { useContext, createContext, useReducer } from 'react';
import { IModalContext } from './types';
import { reducer } from './reducer';

// default context
export const defaultSideMenuContext: IModalContext = {
  visible: false,
  content: {
    type: '',
    data: null,
  },
  showMenu: () => {},
  hideMenu: () => {},
  toggleMenu: () => {},
};

// create context
const ModalContext = createContext(defaultSideMenuContext);

// provider wrapper
export const ModalContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, defaultSideMenuContext);

  const value: IModalContext = {
    visible: state.visible,
    content: state.content,
    showMenu: () => dispatch({ type: 'SHOW MENU' }),
    hideMenu: () => dispatch({ type: 'HIDE MENU' }),
    toggleMenu: () => dispatch({ type: 'TOGGLE MENU' }),
  };

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
};

// Hook for using modal context
export const useModalContext = () => useContext(ModalContext);
