import React from 'react';
import { Button } from '@material-ui/core';
import { AppRouter } from './components/app-router';
import CssBaseline from '@material-ui/core/CssBaseline';

export const App = () => {
  return (
    <>
      <CssBaseline />
      <AppRouter />
    </>
  );
};
