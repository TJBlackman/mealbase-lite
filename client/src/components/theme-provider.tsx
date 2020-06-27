import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

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
  },
});

export const AppThemeProvider = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
