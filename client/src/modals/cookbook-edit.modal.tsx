import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@material-ui/core';
import { EditCookbookForm } from '../forms/cookbook-edit.form';
import { ICookbookRecord } from '../types';

interface IProps {
  onClose: () => void;
  data: ICookbookRecord;
}

export const EditCookbookModal = ({ onClose, data }: IProps) => {
  const onSuccess = () => {
    setTimeout(onClose, 500);
  };

  return (
    <Dialog open={true} onClose={onClose} scroll='paper'>
      <DialogTitle color='primary'>Edit Cookbook</DialogTitle>
      <DialogContent dividers={true}>
        <EditCookbookForm onSuccess={onSuccess} cookbook={data} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary'>
          Dismiss
        </Button>
      </DialogActions>
    </Dialog>
  );
};
