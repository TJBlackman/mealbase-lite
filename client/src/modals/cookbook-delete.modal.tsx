import React, { useReducer } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Grid } from '@material-ui/core';
import { IGenericAction, ICookbookRecord } from '../types';
import { getNewState } from '../utils/copy-state';
import { networkRequest } from '../utils/network-request';
import { useCookbookContext } from '../context/cookbooks';
import { Alert } from '@material-ui/lab';

interface IProps {
  onClose: () => void;
  data: ICookbookRecord;
}

type Action =
  | IGenericAction<'SET LOADING', boolean>
  | IGenericAction<'SET SUCCESS', string | null>
  | IGenericAction<'SET ERROR', string | null>;

interface ILocalState {
  loading: boolean;
  success: string | null;
  error: string | null;
}
const defaultLocalState: ILocalState = {
  loading: false,
  success: null,
  error: null,
};

const reducer = (state: ILocalState, action: Action) => {
  const newState = getNewState<ILocalState>(state);
  switch (action.type) {
    case 'SET ERROR': {
      newState.error = action.payload;
      newState.loading = false;
      return newState;
    }
    case 'SET SUCCESS': {
      newState.success = action.payload;
      return newState;
    }
    case 'SET LOADING': {
      newState.loading = action.payload;
      return newState;
    }
    default: {
      console.error(`Unknown action type:\n${JSON.stringify(action, null, 4)}`);
      return state;
    }
  }
};

export const DeleteCookbookModal = ({ onClose, data }: IProps) => {
  const { removeCookbook } = useCookbookContext();
  const [localState, dispatch] = useReducer(reducer, defaultLocalState);

  const submit = () => {
    dispatch({ type: 'SET LOADING', payload: true });
    networkRequest({
      url: '/api/v1/cookbooks',
      method: 'DELETE',
      body: { _id: data._id },
      success: (response) => {
        removeCookbook(data);
        dispatch({ type: 'SET SUCCESS', payload: 'Cookbook deleted.' });
        setTimeout(onClose, 2000);
      },
      error: (response) => {
        dispatch({ type: 'SET ERROR', payload: response.message });
      },
    });
  };

  return (
    <Dialog open={true} onClose={onClose} scroll='paper'>
      <DialogTitle color='primary'>Delete Cookbook</DialogTitle>
      <DialogContent dividers={true}>
        <Typography variant='body1'>
          Are you sure you want to delete this cookbook? This action can not be undone.
        </Typography>
        {localState.success && (
          <Alert severity='success' elevation={2} style={{ margin: '20px 0' }}>
            {localState.success}
          </Alert>
        )}
        {localState.error && (
          <Alert severity='error' elevation={2} style={{ margin: '20px 0' }}>
            {localState.error}
          </Alert>
        )}
        <Grid container style={{ flexFlow: 'row-reverse' }}>
          <Button
            type='button'
            variant='contained'
            color='primary'
            disabled={localState.loading}
            onClick={submit}
            style={{ marginLeft: '20px' }}
          >
            Delete Cookbook
          </Button>
          <Button type='button' variant='contained' color='default' onClick={onClose}>
            Cancel
          </Button>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary'>
          Dismiss
        </Button>
      </DialogActions>
    </Dialog>
  );
};
