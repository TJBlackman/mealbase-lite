import React from 'react';
import { Button } from '@material-ui/core';
import { AppRouter } from './components/app-router';
import CssBaseline from '@material-ui/core/CssBaseline';
import { AppThemeProvider } from './components/theme-provider';
import { GlobalContextProvider } from './context';

export const App = () => {
  return (
    <GlobalContextProvider>
      <AppThemeProvider>
        <CssBaseline />
        <AppRouter />
      </AppThemeProvider>
    </GlobalContextProvider>
  );
};
