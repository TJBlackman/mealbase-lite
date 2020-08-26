import React, { useReducer, useEffect } from 'react';
import { IGenericAction } from '../types';
import { getNewState } from '../utils/copy-state';
import { makeStyles } from '@material-ui/styles';
import { TextField, Button, Grid } from '@material-ui/core';
import { networkRequest } from '../utils/network-request';
import { Alert } from '@material-ui/lab';
import { useUserContext } from '../context/user';

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
  password: string;
  newPassword: string;
  confirmPassword: string;
  loading: boolean;
  success: string | null;
  error: string | null;
}
const defaultState: IState = {
  password: '',
  newPassword: '',
  confirmPassword: '',
  loading: false,
  success: null,
  error: null,
};

type Actions =
  | IGenericAction<'SET LOADING', boolean>
  | IGenericAction<'SET ERROR', string | null>
  | IGenericAction<'SET SUCCESS', string | null>
  | IGenericAction<'SET PASSWORD', string>
  | IGenericAction<'SET NEW PASSWORD', string>
  | IGenericAction<'SET CONFIRM PASSWORD', string>
  | IGenericAction<'RESET FORM', Partial<IState>>
  | IGenericAction<'SUBMIT FORM'>;

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
    case 'SET PASSWORD': {
      newState.password = action.payload;
      return newState;
    }
    case 'SET NEW PASSWORD': {
      newState.newPassword = action.payload;
      return newState;
    }
    case 'SET CONFIRM PASSWORD': {
      newState.confirmPassword = action.payload;
      return newState;
    }
    case 'RESET FORM': {
      return {
        ...defaultState,
        ...action.payload,
      };
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

const mismatchError = "New passwords don't match.";

interface IProps {
  onSuccess?: () => void;
}

export const EditPasswordForm = ({}: IProps) => {
  const { user, updateUserData } = useUserContext();
  const [localState, dispatch] = useReducer(reducer, defaultState);
  const { formClass, textFieldClass, btnClass, errorClass } = useStyles();

  useEffect(() => {
    // clear mismatch error when they match
    const { error, newPassword, confirmPassword } = localState;
    if (error === mismatchError) {
      if (newPassword === confirmPassword) {
        dispatch({ type: 'SET ERROR', payload: '' });
      }
    }
  }, [localState]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (localState.newPassword !== localState.confirmPassword) {
      dispatch({ type: 'SET ERROR', payload: mismatchError });
      return;
    }
    dispatch({ type: 'SUBMIT FORM' });
    networkRequest({
      url: '/api/v1/users',
      method: 'PUT',
      body: {
        password: localState.password,
        newPassword: localState.newPassword,
        _id: user._id,
      },
      success: (response) => {
        updateUserData(response.data);
        dispatch({ type: 'SET SUCCESS', payload: 'Password updated successfully!' });
        setTimeout(() => dispatch({ type: 'RESET FORM' }), 3000);
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
        type='password'
        className={textFieldClass}
        label='Current Password'
        variant='outlined'
        value={localState.password}
        disabled={disabled}
        onChange={(e) =>
          dispatch({
            type: 'SET PASSWORD',
            payload: e.target.value,
          })
        }
      />
      <TextField
        required
        fullWidth
        type='password'
        className={textFieldClass}
        label='New Password'
        variant='outlined'
        value={localState.newPassword}
        disabled={disabled}
        onChange={(e) =>
          dispatch({
            type: 'SET NEW PASSWORD',
            payload: e.target.value,
          })
        }
      />
      <TextField
        required
        fullWidth
        type='password'
        className={textFieldClass}
        label='Confirm Password'
        variant='outlined'
        value={localState.confirmPassword}
        disabled={disabled}
        onChange={(e) =>
          dispatch({
            type: 'SET CONFIRM PASSWORD',
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
          You must be signed in to update your email address.
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
