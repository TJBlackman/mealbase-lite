import React from 'react';
import { AppRouter } from './components/app-router';
import CssBaseline from '@material-ui/core/CssBaseline';
import { GlobalContextProvider } from './context';
import { AppThemeProvider } from './components/theme-provider';
import { ModalConductor } from './modals/index';
import { ContextMiddleware } from './context/middleware';

export const App = () => {
  return (
    <GlobalContextProvider>
      <ContextMiddleware>
        <AppThemeProvider>
          <CssBaseline />
          <AppRouter />
          <ModalConductor />
        </AppThemeProvider>
      </ContextMiddleware>
    </GlobalContextProvider>
  );
};
