import React, { useReducer, useContext } from 'react';
import { TextField, Button, CircularProgress } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { networkRequest } from '../utils/network-request';
import { useUserContext } from '../context/user';
import { IRecipe, IGenericAction } from '../types';
import { getNewState } from '../utils/copy-state';
import { FormFeedback } from '../components/form-feedback';
import { AccountRequiredWarning } from '../components/account-required-warning';

interface ILocalState {
  url: string;
  loading: boolean;
  error: string | null;
  success: string | null;
}

type Action =
  | IGenericAction<'SET URL', string>
  | IGenericAction<'RESET FORM'>
  | IGenericAction<'SUBMIT FORM'>
  | IGenericAction<'SET ERROR', string>
  | IGenericAction<'SET SUCCESS', string>;

interface ComponentProps {
  onSuccess?: (x: IRecipe) => void;
}

// form default values
const defaultState: ILocalState = {
  url: '',
  loading: false,
  error: null,
  success: null,
};

// form state reducer
const reducer = (state: ILocalState, action: Action) => {
  const newState = getNewState<ILocalState>(state);
  switch (action.type) {
    case 'RESET FORM': {
      return defaultState;
    }
    case 'SUBMIT FORM': {
      newState.loading = true;
      return newState;
    }
    case 'SET URL': {
      newState.url = action.payload;
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
    default: {
      console.error(`Unknown action type:\n${JSON.stringify(action, null, 4)}`);
      return state;
    }
  }
};

// component
export const AddRecipeForm = ({ onSuccess }: ComponentProps) => {
  const { user } = useUserContext();
  const [localState, dispatch] = useReducer(reducer, defaultState);
  const { formClass, textFieldClass, btnClass, errorClass } = useStyles();
  const onSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: 'SUBMIT FORM' });
    networkRequest({
      url: '/api/v1/recipes',
      method: 'POST',
      body: {
        url: localState.url,
      },
      success: (json) => {
        dispatch({ type: 'SET SUCCESS', payload: 'Recipe Found!' });
        setTimeout(() => {
          onSuccess(json.data);
        }, 1000);
      },
      error: (err) => {
        dispatch({ type: 'SET ERROR', payload: err.message });
      },
    });
  };
  const disabled = localState.loading || !user.email;
  return (
    <form onSubmit={onSubmit} className={formClass}>
      <TextField
        className={textFieldClass}
        required
        fullWidth
        label='Recipe URL'
        variant='outlined'
        helperText='The web address of any recipe! Example: https://www.recipes.com/tacos'
        value={localState.url}
        disabled={disabled}
        onChange={(e) =>
          dispatch({
            type: 'SET URL',
            payload: e.target.value,
          })
        }
      />
      <FormFeedback
        success={localState.success}
        error={localState.error}
        clearError={() => dispatch({ type: 'SET ERROR', payload: '' })}
      />
      {!user.email && <AccountRequiredWarning text='before you add your first recipe.' className={errorClass} />}
      <Button
        variant='contained'
        className={btnClass}
        disabled={disabled}
        onClick={() => dispatch({ type: 'RESET FORM' })}
      >
        Reset
      </Button>
      <Button variant='contained' className={btnClass} color='primary' type='submit' disabled={disabled}>
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
