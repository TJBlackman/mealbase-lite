import React from 'react';
import { useHistory } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText, ListItemIcon, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import DynamicFeedIcon from '@material-ui/icons/DynamicFeed';
import InfoIcon from '@material-ui/icons/Info';
import AddToPhotosIcon from '@material-ui/icons/AddToPhotos';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import EventNoteIcon from '@material-ui/icons/EventNote';
import CreateIcon from '@material-ui/icons/Create';
import { networkRequest } from '../utils/network-request';
import { useUserContext } from '../context/user';
import { useSideMenuContext } from '../context/side-menu';

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
  const { user, logout } = useUserContext();
  const { toggleMenu, visible } = useSideMenuContext();

  const userIsLoggedIn = user.email !== '';

  const goTo = (link: string) => {
    toggleMenu();
    history.push(link);
  };

  const onLogout = () => {
    toggleMenu();
    logout();
    networkRequest({
      url: '/api/v1/auth/signout',
    });
  };

  return (
    <Drawer anchor='right' open={visible} PaperProps={{ className: classes.paper }} onClose={toggleMenu}>
      <List component='nav'>
        <ListItem button onClick={toggleMenu}>
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
        <ListItem button onClick={() => goTo('/cookbooks')}>
          <ListItemIcon>
            <MenuBookIcon />
          </ListItemIcon>
          <ListItemText primary='Cookbooks' />
        </ListItem>
        <ListItem button onClick={() => goTo('/mealplans')}>
          <ListItemIcon>
            <EventNoteIcon />
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
            <ListItem button onClick={() => goTo('/account')}>
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
