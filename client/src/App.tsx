import React from 'react';
import { AppRouter } from './components/app-router';
import CssBaseline from '@material-ui/core/CssBaseline';
import { GlobalContextProvider } from './context';
import { AppThemeProvider } from './components/theme-provider';
import { ModalConductor } from './modals/index';
import { ContextMiddleware } from './context/middleware';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import ReactGA from 'react-ga';

// initialize Google Analutics
ReactGA.initialize(process.env.GOOGLE_UNIVERSAL_ANALYTICS);

export const App = () => {
  return (
    <Router>
      <GlobalContextProvider>
        <ContextMiddleware>
          <AppThemeProvider>
            <CssBaseline />
            <Route
              path='/'
              render={({ location }) => {
                ReactGA.pageview(location.pathname + location.search);
                return null;
              }}
            />
            <AppRouter />
            <ModalConductor />
          </AppThemeProvider>
        </ContextMiddleware>
      </GlobalContextProvider>
    </Router>
  );
};
