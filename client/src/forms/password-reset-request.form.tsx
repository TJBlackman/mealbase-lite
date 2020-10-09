import React, { useReducer } from 'react';
import { TextField, Button, CircularProgress } from '@material-ui/core';
import { FormFeedback } from '../components/form-feedback';
import { makeStyles } from '@material-ui/core/styles';
import { networkRequest } from '../utils/network-request';
import { IGenericAction } from '../types';
import { getNewState } from '../utils/copy-state';

interface ILocalState {
  email: string;
  loading: boolean;
  error: string | null;
  success: string | null;
}
type Action =
  | IGenericAction<'SET EMAIL', string>
  | IGenericAction<'SET ERROR', string>
  | IGenericAction<'SET SUCCESS', string>
  | IGenericAction<'SUBMIT FORM'>
  | IGenericAction<'RESET FORM'>;

interface ComponentProps {
  onSuccess?: () => void;
}

// form default values
const defaultState: ILocalState = {
  email: '',
  loading: false,
  error: null,
  success: null,
};

// form state reducer
const reducer = (state: ILocalState, action: Action) => {
  const newState = getNewState<ILocalState>(state);
  switch (action.type) {
    case 'SET EMAIL': {
      newState.email = action.payload;
      return newState;
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
    case 'SUBMIT FORM': {
      newState.loading = true;
      return newState;
    }
    case 'RESET FORM': {
      return defaultState;
    }
    default: {
      console.error(`Unknown action type:\n${JSON.stringify(action, null, 4)}`);
      return state;
    }
  }
};

// component
export const RequestResetPassword = ({ onSuccess }: ComponentProps) => {
  const [localState, dispatch] = useReducer(reducer, defaultState);
  const { formClass, textFieldClass, btnClass } = useStyles();
  const onSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: 'SUBMIT FORM' });
    networkRequest({
      url: '/api/v1/auth/request-reset-password',
      method: 'POST',
      body: {
        email: localState.email,
      },
      success: (json) => {
        dispatch({ type: 'SET SUCCESS', payload: 'Reset Password Email Sent!' });
        setTimeout(onSuccess, 1000);
      },
      error: (err) => {
        dispatch({ type: 'SET ERROR', payload: err.message });
      },
    });
  };
  return (
    <form onSubmit={onSubmit} className={formClass}>
      <TextField
        className={textFieldClass}
        required
        fullWidth
        label='Email Address'
        variant='outlined'
        value={localState.email}
        disabled={localState.loading}
        type='email'
        onChange={(e) =>
          dispatch({
            type: 'SET EMAIL',
            payload: e.target.value,
          })
        }
      />
      <FormFeedback
        success={localState.success}
        error={localState.error}
        clearError={() => dispatch({ type: 'SET ERROR', payload: '' })}
      />
      <Button
        variant='contained'
        className={btnClass}
        disabled={localState.loading}
        onClick={() => dispatch({ type: 'RESET FORM' })}
      >
        Reset
      </Button>
      <Button variant='contained' className={btnClass} color='primary' type='submit' disabled={localState.loading}>
        {localState.loading ? <CircularProgress color='primary' size='20px' /> : 'Submit'}
      </Button>
    </form>
  );
};

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
});
