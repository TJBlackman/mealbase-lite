import React, { useReducer } from 'react';
import { IGenericAction, ICookbookRecord } from '../types';
import { getNewState } from '../utils/copy-state';
import { makeStyles } from '@material-ui/styles';
import { TextField, Button, Grid } from '@material-ui/core';
import { networkRequest } from '../utils/network-request';
import { Alert } from '@material-ui/lab';
import { useCookbookContext } from '../context/cookbooks';

// styles
const useStyles = makeStyles({
  formClass: {
    padding: '20px 0',
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'flex-end',
  },
  textFieldClass: {
    marginBottom: '20px',
    flex: '0 0 100%',
  },
  btnClass: {
    margin: '0 0 20px 20px',
  },
  errorClass: {
    flex: '1 1 100%',
    marginBottom: '20px',
  },
});

interface IState {
  cookbook: ICookbookRecord | null;
  loading: boolean;
  success: string | null;
  error: string | null;
}
const defaultState: IState = {
  cookbook: null,
  loading: false,
  success: null,
  error: null,
};

type Actions =
  | IGenericAction<'SET LOADING', boolean>
  | IGenericAction<'SET ERROR', string | null>
  | IGenericAction<'SET SUCCESS', string | null>
  | IGenericAction<'SET TITLE', string>
  | IGenericAction<'RESET FORM'>
  | IGenericAction<'SUBMIT FORM'>
  | IGenericAction<'SET DESCRIPTION', string>;

const reducer = (state: IState, action: Actions) => {
  const newState = getNewState<IState>(state);
  switch (action.type) {
    case 'SUBMIT FORM': {
      newState.loading = true;
      newState.error = null;
      newState.success = null;
      return newState;
    }
    case 'SET LOADING': {
      newState.loading = action.payload;
      return newState;
    }
    case 'SET TITLE': {
      newState.cookbook.title = action.payload;
      return newState;
    }
    case 'SET DESCRIPTION': {
      newState.cookbook.description = action.payload;
      return newState;
    }
    case 'RESET FORM': {
      return defaultState;
    }
    case 'SET ERROR': {
      newState.error = action.payload;
      newState.loading = false;
      return newState;
    }
    case 'SET SUCCESS': {
      newState.success = action.payload;
      newState.loading = false;
      return newState;
    }
    default: {
      console.error(`Unknown action type:\n${JSON.stringify(action, null, 4)}`);
      return state;
    }
  }
};

interface IProps {
  onSuccess: () => void;
  cookbook: ICookbookRecord;
}

export const EditCookbookForm = ({ onSuccess, cookbook }: IProps) => {
  const defaultReducerState: IState = { ...defaultState, cookbook: cookbook };
  const { updateCookbook } = useCookbookContext();
  const [localState, dispatch] = useReducer(reducer, defaultReducerState);
  const { formClass, textFieldClass, btnClass, errorClass } = useStyles();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch({ type: 'SUBMIT FORM' });
    networkRequest({
      url: '/api/v1/cookbooks',
      method: 'PUT',
      body: localState.cookbook,
      success: (response) => {
        updateCookbook(response.data);
        dispatch({ type: 'SET SUCCESS', payload: 'Cookbook successfully updated!' });
        onSuccess();
      },
      error: (response) => {
        dispatch({ type: 'SET ERROR', payload: response.message });
      },
    });
  };

  const disabled = localState.loading;

  return (
    <form onSubmit={handleSubmit} className={formClass}>
      <TextField
        required
        fullWidth
        className={textFieldClass}
        disabled={disabled}
        label='Cookbook Title'
        variant='outlined'
        value={localState.cookbook.title}
        onChange={(e) =>
          dispatch({
            type: 'SET TITLE',
            payload: e.target.value,
          })
        }
      />
      <TextField
        required
        fullWidth
        multiline
        rows={3}
        className={textFieldClass}
        disabled={disabled}
        label='Cookbook Description'
        variant='outlined'
        value={localState.cookbook.description}
        onChange={(e) =>
          dispatch({
            type: 'SET DESCRIPTION',
            payload: e.target.value,
          })
        }
      />

      {localState.success && (
        <Alert severity='success' className={errorClass} elevation={2}>
          {localState.success}
        </Alert>
      )}
      {localState.error && (
        <Alert severity='error' className={errorClass} elevation={2}>
          {localState.error}
        </Alert>
      )}
      <Grid container style={{ flexFlow: 'row-reverse' }}>
        <Button type='submit' variant='contained' color='primary' className={btnClass} disabled={disabled}>
          Submit
        </Button>
        <Button
          type='button'
          variant='contained'
          color='default'
          onClick={() => dispatch({ type: 'RESET FORM' })}
          className={btnClass}
          disabled={disabled}
        >
          Reset
        </Button>
      </Grid>
    </form>
  );
};
