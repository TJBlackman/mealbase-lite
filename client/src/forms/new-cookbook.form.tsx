import React, { useReducer } from 'react';
import { IGenericAction } from '../types';
import { getNewState } from '../utils/copy-state';
import { makeStyles } from '@material-ui/styles';
import { TextField, Button, Grid } from '@material-ui/core';
import { networkRequest } from '../utils/network-request';
import { Alert } from '@material-ui/lab';
import { useUserContext } from '../context/user';
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
  title: string;
  description: string;
  loading: boolean;
  success: string | null;
  error: string | null;
}
const defaultState: IState = {
  title: '',
  description: '',
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
      newState.title = action.payload;
      return newState;
    }
    case 'SET DESCRIPTION': {
      newState.description = action.payload;
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
}

export const NewCookbookForm = ({ onSuccess }: IProps) => {
  const { user } = useUserContext();
  const { addCookbook } = useCookbookContext();
  const [localState, dispatch] = useReducer(reducer, defaultState);
  const { formClass, textFieldClass, btnClass, errorClass } = useStyles();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch({ type: 'SUBMIT FORM' });
    networkRequest({
      url: '/api/v1/cookbooks',
      method: 'POST',
      body: {
        title: localState.title,
        description: localState.description,
      },
      success: (response) => {
        addCookbook(response.data);
        dispatch({ type: 'SET SUCCESS', payload: 'Cookbook successfully created!' });
        onSuccess();
      },
      error: (response) => {
        dispatch({ type: 'SET ERROR', payload: response.message });
      },
    });
  };

  const disabled = !user.email || localState.loading;

  return (
    <form onSubmit={handleSubmit} className={formClass}>
      <TextField
        required
        fullWidth
        className={textFieldClass}
        label='Cookbook Title'
        variant='outlined'
        value={localState.title}
        disabled={localState.loading}
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
        label='Cookbook Description'
        variant='outlined'
        value={localState.description}
        disabled={localState.loading}
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
      {!user.email && (
        <Alert severity='warning' className={errorClass} elevation={2}>
          You must have an account to create cookbooks.
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
        >
          Reset
        </Button>
      </Grid>
    </form>
  );
};
