import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@material-ui/core';
import { NewCookbookForm } from '../forms/cookbook-new.form';

interface IProps {
  onClose: () => void;
}

export const AddCookbookModal = ({ onClose }: IProps) => {
  const onSuccess = () => {
    setTimeout(onClose, 500);
  };

  return (
    <Dialog open={true} onClose={onClose} scroll='paper'>
      <DialogTitle color='primary'>Add New Cookbook</DialogTitle>
      <DialogContent dividers={true}>
        <Typography variant='body1'>Please provide a title and description for this cookbook!</Typography>
        <NewCookbookForm onSuccess={onSuccess} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary'>
          Dismiss
        </Button>
      </DialogActions>
    </Dialog>
  );
};
