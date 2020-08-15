import React, { useContext, createContext, useReducer } from 'react';
import { IModalContext } from './types';
import { reducer } from './reducer';

// default context
export const defaultSideMenuContext: IModalContext = {
  visible: false,
  content: {
    modalType: '',
    modalData: null,
  },
  showModal: () => {},
  dismissModal: () => {},
};

// create context
const ModalContext = createContext(defaultSideMenuContext);

// provider wrapper
export const ModalContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, defaultSideMenuContext);

  const value: IModalContext = {
    visible: state.visible,
    content: state.content,
    showModal: (payload) => dispatch({ type: 'SHOW MODAL', payload }),
    dismissModal: () => dispatch({ type: 'DISMISS MODAL' }),
  };

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
};

// Hook for using modal context
export const useModalContext = () => useContext(ModalContext);
