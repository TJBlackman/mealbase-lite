import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@material-ui/core';
import { NewCookbookForm } from '../forms/new-cookbook.form';

interface IProps {
  onClose: () => void;
}

export const AddCookbookModal = ({ onClose }: IProps) => {
  return (
    <Dialog open={true} onClose={onClose} scroll='paper'>
      <DialogTitle color='primary'>Add New Cookbook</DialogTitle>
      <DialogContent dividers={true}>
        <NewCookbookForm />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary'>
          Dismiss
        </Button>
      </DialogActions>
    </Dialog>
  );
};
