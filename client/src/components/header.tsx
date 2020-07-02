import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import MenuIcon from '@material-ui/icons/Menu';
import { AppBar, Toolbar, Typography, IconButton, Container, Link, Hidden } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AppContext } from '../context';

export default function Header() {
  const { toggleSideMenu, globalState } = useContext(AppContext);
  const history = useHistory();
  const { wrapper, link } = getStyles();
  return (
    <AppBar position='static'>
      <Container maxWidth='lg' disableGutters>
        <Toolbar className={wrapper}>
          <Typography variant='h6'>MealBase Lite</Typography>
          <div>
            {globalState.user.email !== '' ? (
              <Hidden xsDown>
                <Typography variant='body2' component='span' style={{ marginRight: '4px', userSelect: 'none' }}>
                  Welcome,
                </Typography>
                <Link onClick={() => history.push('/account')} color='inherit'>
                  {globalState.user.email}
                </Link>
              </Hidden>
            ) : (
              <Hidden xsDown>
                <Link onClick={() => history.push('/login')} color='inherit' className={link}>
                  Login
                </Link>
                <Link onClick={() => history.push('/register')} color='inherit' className={link}>
                  Register
                </Link>
              </Hidden>
            )}
            <IconButton onClick={toggleSideMenu} color='inherit' aria-label='menu'>
              <MenuIcon />
            </IconButton>
          </div>
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
  link: {
    padding: '10px',
    margin: '0 5px',
  },
});
