import React, { useReducer } from 'react';
import { TextField, Button, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { networkRequest } from '../utils/network-request';
import { useUserContext } from '../context/user';
import { IGenericAction } from '../types';
import { getNewState } from '../utils/copy-state';
import { FormFeedback } from '../components/form-feedback';

interface ILocalState {
  email: string;
  password: string;
  confirmPw: string;
  loading: boolean;
  error: string | null;
  success: string | null;
}
type Action =
  | IGenericAction<'SET EMAIL', string>
  | IGenericAction<'SET PASSWORD', string>
  | IGenericAction<'SET CONFIRM PASSWORD', string>
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
  password: '',
  confirmPw: '',
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
    case 'SET PASSWORD': {
      newState.password = action.payload;
      return newState;
    }
    case 'SET CONFIRM PASSWORD': {
      newState.confirmPw = action.payload;
      return newState;
    }
    case 'SET SUCCESS': {
      newState.success = action.payload;
      return newState;
    }
    case 'SET ERROR': {
      newState.error = action.payload;
      newState.loading = false;
      return newState;
    }
    case 'SET SUCCESS': {
      newState.success = action.payload;
      return newState;
    }
    case 'RESET FORM': {
      return defaultState;
    }
    case 'SUBMIT FORM': {
      newState.loading = true;
      return newState;
    }
    default: {
      console.error(`Unknown action type:\n${JSON.stringify(action, null, 4)}`);
      return state;
    }
  }
};

// component
export const RegisterForm = ({ onSuccess }: ComponentProps) => {
  const { updateUserData } = useUserContext();
  const [localState, dispatch] = useReducer(reducer, defaultState);
  const { formClass, textFieldClass, btnClass, errorClass } = useStyles();
  const onSubmit = (e) => {
    e.preventDefault();
    if (localState.password !== localState.confirmPw) {
      dispatch({ type: 'SET ERROR', payload: 'Passwords do not match.' });
      return;
    }
    dispatch({ type: 'SUBMIT FORM' });
    networkRequest({
      url: '/api/v1/users',
      method: 'POST',
      body: {
        email: localState.email,
        password: localState.password,
      },
      success: (json) => {
        updateUserData(json.data);
        dispatch({ type: 'SET SUCCESS', payload: 'Registration Successful!' });
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
        type='email'
        value={localState.email}
        onChange={(e) =>
          dispatch({
            type: 'SET EMAIL',
            payload: e.target.value,
          })
        }
      />
      <TextField
        className={textFieldClass}
        required
        fullWidth
        label='Password'
        variant='outlined'
        type='password'
        value={localState.password}
        onChange={(e) =>
          dispatch({
            type: 'SET PASSWORD',
            payload: e.target.value,
          })
        }
      />
      <TextField
        className={textFieldClass}
        required
        fullWidth
        label='Confirm Password'
        variant='outlined'
        type='password'
        value={localState.confirmPw}
        onChange={(e) =>
          dispatch({
            type: 'SET CONFIRM PASSWORD',
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
        onClick={() => dispatch({ type: 'RESET FORM' })}
        disabled={localState.loading}
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
  errorClass: {
    flex: '1 1 100%',
    marginBottom: '20px',
  },
});
