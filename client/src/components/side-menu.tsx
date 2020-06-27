import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText, ListItemIcon, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AppContext } from '../context';

import CloseIcon from '@material-ui/icons/Close';
import ChromeReaderModeIcon from '@material-ui/icons/ChromeReaderMode';
import DynamicFeedIcon from '@material-ui/icons/DynamicFeed';
import InfoIcon from '@material-ui/icons/Info';
import AddToPhotosIcon from '@material-ui/icons/AddToPhotos';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import CreateIcon from '@material-ui/icons/Create';

const useStyles = makeStyles({
  paper: {
    minWidth: '300px',
  },
  divider: {
    margin: '20px 0',
  },
});

export const SideMenu = () => {
  const classes = useStyles();
  const history = useHistory();
  const { globalState, toggleSideMenu, logout } = useContext(AppContext);

  const userIsLoggedIn = globalState.user.email !== '';

  const goTo = (link: string) => {
    toggleSideMenu();
    history.push(link);
  };

  const onLogout = () => {
    toggleSideMenu();
    logout();
  };

  return (
    <Drawer
      anchor='right'
      open={globalState.sidemenu.visible}
      PaperProps={{ className: classes.paper }}
      onClose={toggleSideMenu}
    >
      <List component='nav'>
        <ListItem button onClick={toggleSideMenu}>
          <ListItemIcon>
            <CloseIcon />
          </ListItemIcon>
          <ListItemText primary='Close Menu' />
        </ListItem>
        <Divider className={classes.divider} />
        <ListItem button onClick={() => goTo('/browse')}>
          <ListItemIcon>
            <DynamicFeedIcon />
          </ListItemIcon>
          <ListItemText primary='Browse Recipes' />
        </ListItem>
        <ListItem button onClick={() => goTo('/mealplan')}>
          <ListItemIcon>
            <ChromeReaderModeIcon />
          </ListItemIcon>
          <ListItemText primary='Mealplans' />
        </ListItem>
        <ListItem button onClick={() => goTo('/add-recipe')}>
          <ListItemIcon>
            <AddToPhotosIcon />
          </ListItemIcon>
          <ListItemText primary='Add Recipe' />
        </ListItem>
        <ListItem button onClick={() => goTo('/about')}>
          <ListItemIcon>
            <InfoIcon />
          </ListItemIcon>
          <ListItemText primary='FAQ' />
        </ListItem>
        <Divider className={classes.divider} />
        {userIsLoggedIn ? (
          <>
            <ListItem button onClick={() => goTo('/')}>
              <ListItemIcon>
                <AccountBoxIcon />
              </ListItemIcon>
              <ListItemText primary='My Account' />
            </ListItem>
            <ListItem button onClick={onLogout}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary='Log Out' />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem button onClick={() => goTo('/login')}>
              <ListItemIcon>
                <AccountBoxIcon />
              </ListItemIcon>
              <ListItemText primary='Login' />
            </ListItem>
            <ListItem button onClick={() => goTo('/register')}>
              <ListItemIcon>
                <CreateIcon />
              </ListItemIcon>
              <ListItemText primary='Register' />
            </ListItem>
          </>
        )}
      </List>
    </Drawer>
  );
};
