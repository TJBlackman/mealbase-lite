import React, { useContext, useEffect } from 'react';
import { AppRouter } from './components/app-router';
import CssBaseline from '@material-ui/core/CssBaseline';
import { AppThemeProvider } from './components/theme-provider';
import { ModalConductor } from './modals/index';
import { networkRequest } from './utils/network-request';
import { AppContext } from './context';

export const App = () => {
  const { globalState, updateUserData } = useContext(AppContext);

  useEffect(() => {
    const isLoggedOut = globalState.user.email === '';
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
    <AppThemeProvider>
      <CssBaseline />
      <AppRouter />
      <ModalConductor />
    </AppThemeProvider>
  );
};
