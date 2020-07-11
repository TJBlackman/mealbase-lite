import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import createBreakpoints from '@material-ui/core/styles/createBreakpoints';

// use breakpoints
const breakpoints = createBreakpoints({});

// define theme
const theme = createMuiTheme({
  overrides: {
    MuiCssBaseline: {
      '@global': {
        a: {
          cursor: 'default',
        },
      },
    },
    MuiDialog: {
      paper: {
        [breakpoints.down('sm')]: {
          margin: '12px',
        },
      },
    },
  },
});

export const AppThemeProvider = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
