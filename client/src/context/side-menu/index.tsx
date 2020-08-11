import React, { useContext, createContext, useReducer } from 'react';
import { ISideMenuContext } from './types';
import { reducer } from './reducer';

// default context
export const defaultSideMenuContext: ISideMenuContext = {
  visible: false,
  showMenu: () => {},
  hideMenu: () => {},
  toggleMenu: () => {},
};

// create context
const SideMenuContext = createContext(defaultSideMenuContext);

// provider wrapper
export const SideMenuContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, defaultSideMenuContext);

  const value: ISideMenuContext = {
    visible: state.visible,
    showMenu: () => dispatch({ type: 'SHOW MENU' }),
    hideMenu: () => dispatch({ type: 'HIDE MENU' }),
    toggleMenu: () => dispatch({ type: 'TOGGLE MENU' }),
  };

  return <SideMenuContext.Provider value={value}>{children}</SideMenuContext.Provider>;
};

// Hook for using sidemenu context
export const useSideMenuContext = () => useContext(SideMenuContext);
