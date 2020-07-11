import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, makeStyles } from '@material-ui/core';

interface IProps {
  onClose: () => void;
}

export const ComingSoonModal = ({ onClose }: IProps) => {
  return (
    <Dialog open={true} onClose={onClose} scroll='paper'>
      <DialogTitle color='primary'>Feature Coming Soon</DialogTitle>
      <DialogContent dividers={true}>
        <Typography variant='h4' style={{ margin: '20px 0 100px 0' }}>
          Please be patient!
          <br />
          This feature is coming soon!
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary'>
          Dismiss
        </Button>
      </DialogActions>
    </Dialog>
  );
};
