import React, { useReducer, useContext } from 'react';
import { TextField, Button, CircularProgress } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { networkRequest } from '../utils/network-request';
import { AppContext } from '../context';

interface IRegisterFormValues {
  email: string;
  password: string;
  confirmPw: string;
  loading: boolean;
  error: string | null;
  success: string | null;
}
interface Action {
  type: number;
  value?: string;
}
enum ActionType {
  UPDATE_EMAIL,
  UPDATE_PASSWORD,
  UPDATE_CONFIRM_PW,
  LOADING_FALSE,
  LOADING_TRUE,
  RESET,
  SET_ERROR,
  CLEAR_ERROR,
  SHOW_SUCCESS,
}
interface ComponentProps {
  onSuccess?: () => void;
}
// form default values
const defaultValues: IRegisterFormValues = {
  email: '',
  password: '',
  confirmPw: '',
  loading: false,
  error: null,
  success: null,
};

// form state reducer
const reducer = (state: IRegisterFormValues, action: Action) => {
  const newState: IRegisterFormValues = { ...state };
  switch (action.type) {
    case ActionType.UPDATE_EMAIL: {
      newState.email = action.value;
      break;
    }
    case ActionType.UPDATE_PASSWORD: {
      newState.password = action.value;
      break;
    }
    case ActionType.UPDATE_CONFIRM_PW: {
      newState.confirmPw = action.value;
      break;
    }
    case ActionType.LOADING_FALSE: {
      newState.loading = false;
      break;
    }
    case ActionType.LOADING_TRUE: {
      newState.loading = true;
      break;
    }
    case ActionType.SET_ERROR: {
      newState.error = action.value;
      break;
    }
    case ActionType.CLEAR_ERROR: {
      newState.error = null;
      break;
    }
    case ActionType.SHOW_SUCCESS: {
      newState.success = 'Registration Successful!';
      break;
    }
    case ActionType.RESET: {
      return { ...defaultValues };
    }
    default: {
      console.error(`Unknown action type: ${action.type}`);
    }
  }
  return newState;
};

// component
export const RegisterForm = ({ onSuccess }: ComponentProps) => {
  const { updateUserData } = useContext(AppContext);
  const [state, dispatch] = useReducer(reducer, defaultValues);
  const { formClass, textFieldClass, btnClass, errorClass } = useStyles();
  const onSubmit = (e) => {
    e.preventDefault();
    networkRequest({
      url: '/api/v1/users',
      method: 'POST',
      body: {
        email: state.email,
        password: state.password,
      },
      before: () => {
        dispatch({ type: ActionType.LOADING_TRUE });
        dispatch({ type: ActionType.CLEAR_ERROR });
      },
      success: (json) => {
        updateUserData(json.data);
        dispatch({ type: ActionType.SHOW_SUCCESS });
        setTimeout(onSuccess, 1000);
      },
      error: (err) => {
        dispatch({ type: ActionType.LOADING_FALSE });
        dispatch({ type: ActionType.SET_ERROR, value: err.message });
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
        value={state.email}
        onChange={(e) =>
          dispatch({
            type: ActionType.UPDATE_EMAIL,
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
            type: ActionType.UPDATE_PASSWORD,
            value: e.target.value,
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
        value={state.confirmPw}
        onChange={(e) =>
          dispatch({
            type: ActionType.UPDATE_CONFIRM_PW,
            value: e.target.value,
          })
        }
      />
      {state.error && (
        <Alert
          severity='error'
          className={errorClass}
          elevation={2}
          onClose={() => dispatch({ type: ActionType.CLEAR_ERROR })}
        >
          {state.error}
        </Alert>
      )}
      {state.success && (
        <Alert severity='success' className={errorClass} elevation={2}>
          {state.success}
        </Alert>
      )}
      <Button variant='contained' className={btnClass} onClick={() => dispatch({ type: ActionType.RESET })}>
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
