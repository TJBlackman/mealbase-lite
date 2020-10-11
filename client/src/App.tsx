import React from 'react';
import { AppRouter } from './components/app-router';
import CssBaseline from '@material-ui/core/CssBaseline';
import { GlobalContextProvider } from './context';
import { AppThemeProvider } from './components/theme-provider';
import { ModalConductor } from './modals/index';
import { ContextMiddleware } from './context/middleware';
import { BrowserRouter as Router } from 'react-router-dom';


export const App = () => {
  return (
    <Router>
      <GlobalContextProvider>
        <ContextMiddleware>
          <AppThemeProvider>
            <CssBaseline />
            <AppRouter />
            <ModalConductor />
          </AppThemeProvider>
        </ContextMiddleware>
      </GlobalContextProvider>
    </Router>
  );
};
