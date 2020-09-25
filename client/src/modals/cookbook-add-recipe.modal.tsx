import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { IRecipe } from '../types';
import { AddRecipeToCookbookForm } from '../forms/cookbook-add-recipe.form';

interface IProps {
  onClose: () => void;
  data: IRecipe;
}

export const AddRecipeToCookbookModal = ({ onClose, data }: IProps) => {
  return (
    <Dialog open={true} onClose={onClose} scroll='paper'>
      <DialogTitle color='primary'>Add Recipe To Cookbook</DialogTitle>
      <DialogContent dividers={true}>
        <AddRecipeToCookbookForm recipe={data} onSuccess={() => setTimeout(onClose, 3000)} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary'>
          Dismiss
        </Button>
      </DialogActions>
    </Dialog>
  );
};
