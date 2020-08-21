import React, { useEffect } from 'react';
import { AppRouter } from './components/app-router';
import CssBaseline from '@material-ui/core/CssBaseline';
import { GlobalContextProvider } from './context';
import { AppThemeProvider } from './components/theme-provider';
import { ModalConductor } from './modals/index';
import { networkRequest } from './utils/network-request';
import { useUserContext } from './context/user';
import { ContextMiddleware } from './context/middleware';

export const App = () => {
  const { user, updateUserData } = useUserContext();

  useEffect(() => {
    const isLoggedOut = user.email === '';
    if (isLoggedOut) {
      networkRequest({
        url: '/api/v1/users/my-cookie',
        success: (json) => {
          if (!json.data) {
            return;
          }
          const { _id, roles, email } = json.data;
          updateUserData({
            _id,
            roles,
            email,
          });
        },
      });
    }
  }, []);

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
