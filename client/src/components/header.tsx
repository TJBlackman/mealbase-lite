import React, { useContext } from 'react';
import MenuIcon from '@material-ui/icons/Menu';
import { AppBar, Toolbar, Typography, IconButton, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AppContext } from '../context';

export default function Header() {
  const { toggleSideMenu } = useContext(AppContext);
  const { wrapper } = getStyles();
  return (
    <AppBar position='static'>
      <Container maxWidth='lg' disableGutters>
        <Toolbar className={wrapper}>
          <Typography variant='h6'>MealBase Lite</Typography>
          <IconButton onClick={toggleSideMenu} color='inherit' aria-label='menu'>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

// styles
const getStyles = makeStyles({
  wrapper: {
    display: 'flex',
    justifyContent: 'space-between',
  },
});
