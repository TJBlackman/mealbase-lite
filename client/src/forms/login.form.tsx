import React, { useReducer, useContext } from 'react';
import { TextField, Button, CircularProgress } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { networkRequest } from '../utils/network-request';
import { AppContext } from '../context';

interface ILoginFormValues {
  email: string;
  password: string;
  loading: boolean;
  error: string | null;
}
interface Action {
  type: string;
  value?: string;
}

// form default values
const defaultValues: ILoginFormValues = {
  email: '',
  password: '',
  loading: false,
  error: null,
};

// reducer action types
const actions = {
  UPDATE_EMAIL: 'UPDATE EMAIL',
  UPDATE_PASSWORD: 'UPDATE PASSWORD',
  LOADING_FALSE: 'LOADING FALSE',
  LOADING_TRUE: 'LOADING TRUE',
  RESET: 'RESET',
  SET_ERROR: 'SET ERROR',
  CLEAR_ERROR: 'CLEAR ERROR',
};

// form state reducer
const reducer = (state: ILoginFormValues, action: Action) => {
  const newState: ILoginFormValues = { ...state };
  switch (action.type) {
    case actions.UPDATE_EMAIL: {
      newState.email = action.value;
      break;
    }
    case actions.UPDATE_PASSWORD: {
      newState.password = action.value;
      break;
    }
    case actions.LOADING_FALSE: {
      newState.loading = false;
      break;
    }
    case actions.LOADING_TRUE: {
      newState.loading = true;
      break;
    }
    case actions.SET_ERROR: {
      newState.error = action.value;
      break;
    }
    case actions.CLEAR_ERROR: {
      newState.error = null;
      break;
    }
    case actions.RESET: {
      return { ...defaultValues };
    }
    default: {
      console.error(`Unknown action type: ${action.type}`);
    }
  }
  return newState;
};

// component
export const LoginForm = () => {
  const { updateUserData } = useContext(AppContext);
  const [state, dispatch] = useReducer(reducer, defaultValues);
  const { formClass, textFieldClass, btnClass, errorClass } = useStyles();
  const onSubmit = (e) => {
    e.preventDefault();
    networkRequest({
      url: '/api/v1/auth/local',
      method: 'POST',
      body: {
        email: state.email,
        password: state.password,
      },
      before: () => {
        dispatch({ type: actions.LOADING_TRUE });
        dispatch({ type: actions.CLEAR_ERROR });
      },
      success: (json) => {
        updateUserData(json.data);
        dispatch({ type: actions.LOADING_FALSE });
      },
      error: (err) => {
        dispatch({ type: actions.LOADING_FALSE });
        dispatch({ type: actions.SET_ERROR, value: err.message });
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
        value={state.email}
        onChange={(e) =>
          dispatch({
            type: actions.UPDATE_EMAIL,
            value: e.target.value,
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
        value={state.password}
        onChange={(e) =>
          dispatch({
            type: actions.UPDATE_PASSWORD,
            value: e.target.value,
          })
        }
      />
      {state.error && (
        <Alert severity='error' variant='filled' className={errorClass} elevation={3}>
          {state.error}
        </Alert>
      )}
      <Button variant='contained' className={btnClass} onClick={() => dispatch({ type: actions.RESET })}>
        Reset
      </Button>
      <Button variant='contained' className={btnClass} color='primary' type='submit' disabled={state.loading}>
        {state.loading ? <CircularProgress color='primary' size='20px' /> : 'Submit'}
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
