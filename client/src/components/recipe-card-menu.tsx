import React, { useState } from 'react';
import { IRecipe, IUserData } from '../types';
import { Menu, MenuItem, ListItemIcon, Typography } from '@material-ui/core';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import DoneIcon from '@material-ui/icons/Done';
import ReportIcon from '@material-ui/icons/Report';
import LinkIcon from '@material-ui/icons/Link';
import DeleteIcon from '@material-ui/icons/Delete';
import EventNoteIcon from '@material-ui/icons/EventNote';
import { copyTextToClipboard } from '../utils/copy-to-clipboard';
import { useModalContext } from '../context/modal';
import { useRecipeContext } from '../context/recipes';
import EditIcon from '@material-ui/icons/Edit';
import { useHistory } from 'react-router-dom';

interface IProps {
  recipe: IRecipe;
  user: IUserData;
  anchor: Element;
  onClose: () => void;
}

export const RecipeCardMenu = ({ recipe, user, anchor, onClose }: IProps) => {
  const history = useHistory();
  const { showModal } = useModalContext();
  const { filters } = useRecipeContext();
  const [copied, setCopied] = useState(false);
  const copyLink = () => {
    copyTextToClipboard(recipe.url);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const userIsLoggedIn = user.email !== '';
  const userIsAdmin = userIsLoggedIn && user.roles.includes('admin');
  const cookbookSelected = filters.cookbook !== '';

  const deleteModal = () => {
    showModal({
      modalType: 'DELETE RECIPE',
      modalData: recipe,
    });
    onClose();
  };

  const comingSoonModal = () => {
    showModal({
      modalType: 'COMING SOON',
    });
    onClose();
  };

  const addRecipeToCookbook = () => {
    showModal({
      modalType: 'ADD RECIPE TO COOKBOOK',
      modalData: recipe,
    });
    onClose();
  };

  const removeRecipeFromCookbook = () => {
    showModal({
      modalType: 'REMOVE FROM COOKBOOK',
      modalData: {
        recipe,
        cookbookId: filters.cookbook,
      },
    });
    onClose();
  };

  const goToEditRecipe = () => {
    history.push(`/edit-recipe/${recipe._id}`);
  };

  return (
    <Menu anchorEl={anchor} keepMounted open={true} onClose={onClose}>
      {userIsLoggedIn && !cookbookSelected && (
        <MenuItem onClick={addRecipeToCookbook}>
          <ListItemIcon>
            <MenuBookIcon fontSize='small' />
          </ListItemIcon>
          <Typography variant='inherit' noWrap>
            Add to Cookbook
          </Typography>
        </MenuItem>
      )}
      {userIsLoggedIn && cookbookSelected && (
        <MenuItem onClick={removeRecipeFromCookbook}>
          <ListItemIcon>
            <MenuBookIcon fontSize='small' />
          </ListItemIcon>
          <Typography variant='inherit' noWrap>
            Remove from Cookbook
          </Typography>
        </MenuItem>
      )}
      {userIsLoggedIn && userIsAdmin && (
        <MenuItem onClick={goToEditRecipe}>
          <ListItemIcon>
            <EditIcon fontSize='small' />
          </ListItemIcon>
          <Typography variant='inherit' noWrap>
            Edit Recipe
          </Typography>
        </MenuItem>
      )}
      {userIsLoggedIn && (
        <MenuItem onClick={comingSoonModal}>
          <ListItemIcon>
            <EventNoteIcon fontSize='small' />
          </ListItemIcon>
          <Typography variant='inherit' noWrap>
            Add to Mealplan
          </Typography>
        </MenuItem>
      )}
      <MenuItem onClick={copyLink}>
        <ListItemIcon>{copied ? <DoneIcon fontSize='small' /> : <LinkIcon fontSize='small' />}</ListItemIcon>
        <Typography variant='inherit' noWrap>
          Copy Link
        </Typography>
      </MenuItem>
      {userIsLoggedIn && (
        <MenuItem onClick={comingSoonModal}>
          <ListItemIcon>
            <ReportIcon fontSize='small' />
          </ListItemIcon>
          <Typography variant='inherit' noWrap>
            Report
          </Typography>
        </MenuItem>
      )}
      {userIsAdmin && (
        <MenuItem onClick={deleteModal}>
          <ListItemIcon>
            <DeleteIcon fontSize='small' />
          </ListItemIcon>
          <Typography variant='inherit' noWrap>
            Delete
          </Typography>
        </MenuItem>
      )}
    </Menu>
  );
};
