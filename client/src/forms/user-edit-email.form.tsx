import React, { useReducer } from 'react';
import { IGenericAction } from '../types';
import { getNewState } from '../utils/copy-state';
import { makeStyles } from '@material-ui/styles';
import { TextField, Button, Grid } from '@material-ui/core';
import { networkRequest } from '../utils/network-request';
import { Alert } from '@material-ui/lab';
import { useUserContext } from '../context/user';
import { FormFeedback } from '../components/form-feedback';

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
  email: string;
  password: string;
  loading: boolean;
  success: string | null;
  error: string | null;
}
const defaultState: IState = {
  email: '',
  password: '',
  loading: false,
  success: null,
  error: null,
};

type Actions =
  | IGenericAction<'SET LOADING', boolean>
  | IGenericAction<'SET ERROR', string | null>
  | IGenericAction<'SET SUCCESS', string | null>
  | IGenericAction<'SET EMAIL', string>
  | IGenericAction<'SET PASSWORD', string>
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
    case 'SET EMAIL': {
      newState.email = action.payload;
      return newState;
    }
    case 'SET PASSWORD': {
      newState.password = action.payload;
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

interface IProps {
  onSuccess?: () => void;
}

export const EditEmailAddressForm = ({}: IProps) => {
  const { user, updateUserData } = useUserContext();
  const [localState, dispatch] = useReducer(reducer, {
    ...defaultState,
    email: user.email,
  });
  const { formClass, textFieldClass, btnClass, errorClass } = useStyles();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch({ type: 'SUBMIT FORM' });
    networkRequest({
      url: '/api/v1/users',
      method: 'PUT',
      body: {
        email: localState.email,
        password: localState.password,
        _id: user._id,
      },
      success: (response) => {
        updateUserData(response.data);
        dispatch({ type: 'SET SUCCESS', payload: 'Email updated successfully!' });
        setTimeout(() => dispatch({ type: 'RESET FORM', payload: { email: response.data.email } }), 2000);
      },
      error: (response) => {
        dispatch({ type: 'SET ERROR', payload: response.message });
      },
    });
  };

  const disabled = !user.email || localState.loading || localState.email === user.email;

  return (
    <form onSubmit={handleSubmit} className={formClass}>
      <TextField
        required
        fullWidth
        className={textFieldClass}
        label='Email Address'
        variant='outlined'
        value={localState.email}
        disabled={localState.loading}
        onChange={(e) =>
          dispatch({
            type: 'SET EMAIL',
            payload: e.target.value,
          })
        }
      />
      <TextField
        required
        fullWidth
        type='password'
        className={textFieldClass}
        label='Password'
        variant='outlined'
        value={localState.password}
        disabled={localState.loading}
        helperText='Password is requird when changing email address.'
        onChange={(e) =>
          dispatch({
            type: 'SET PASSWORD',
            payload: e.target.value,
          })
        }
      />
      <FormFeedback
        success={localState.success}
        error={localState.error}
        clearError={() => dispatch({ type: 'SET ERROR', payload: '' })}
      />
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
          onClick={() => dispatch({ type: 'RESET FORM', payload: { email: user.email } })}
          className={btnClass}
        >
          Reset
        </Button>
      </Grid>
    </form>
  );
};
