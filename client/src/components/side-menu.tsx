import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText, ListItemIcon, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AppContext } from '../context';

import CloseIcon from '@material-ui/icons/Close';
import ChromeReaderModeIcon from '@material-ui/icons/ChromeReaderMode';
import DynamicFeedIcon from '@material-ui/icons/DynamicFeed';
import InfoIcon from '@material-ui/icons/Info';

const useStyles = makeStyles({
  paper: {
    minWidth: '300px',
  },
});

export const SideMenu = () => {
  const classes = useStyles();
  const history = useHistory();
  const {
    globalState: {
      sidemenu: { visible },
    },
    toggleSideMenu,
  } = useContext(AppContext);
  return (
    <Drawer anchor='right' open={visible} classes={classes} onClose={toggleSideMenu}>
      <List component='nav'>
        <ListItem button onClick={toggleSideMenu}>
          <ListItemIcon>
            <CloseIcon />
          </ListItemIcon>
          <ListItemText primary='Close Menu' />
        </ListItem>
        <Divider />
        <ListItem button onClick={() => history.push('/browse')}>
          <ListItemIcon>
            <DynamicFeedIcon />
          </ListItemIcon>
          <ListItemText primary='Browse Recipes' />
        </ListItem>
        <ListItem button onClick={() => history.push('/mealplans')}>
          <ListItemIcon>
            <ChromeReaderModeIcon />
          </ListItemIcon>
          <ListItemText primary='Mealplans' />
        </ListItem>
        <ListItem button onClick={() => history.push('/add-recipe')}>
          <ListItemIcon>
            <InfoIcon />
          </ListItemIcon>
          <ListItemText primary='Add Recipe' />
        </ListItem>
      </List>
    </Drawer>
  );
};
