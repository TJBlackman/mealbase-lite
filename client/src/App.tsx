import React from 'react';
import { AppRouter } from './components/app-router';
import CssBaseline from '@material-ui/core/CssBaseline';
import { AppThemeProvider } from './components/theme-provider';
import { GlobalContextProvider } from './context';
import { ModalConductor } from './modals/index';

export const App = () => {
  return (
    <GlobalContextProvider>
      <AppThemeProvider>
        <CssBaseline />
        <AppRouter />
        <ModalConductor />
      </AppThemeProvider>
    </GlobalContextProvider>
  );
};
