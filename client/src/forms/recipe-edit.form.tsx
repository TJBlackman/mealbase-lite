import React, { useEffect, useReducer } from 'react';
import { TextField, Button, CircularProgress } from '@material-ui/core';
import { FormFeedback } from '../components/form-feedback';
import { makeStyles } from '@material-ui/core/styles';
import { networkRequest } from '../utils/network-request';
import { useUserContext } from '../context/user';
import { IGenericAction, IRecipe } from '../types';
import { getNewState } from '../utils/copy-state';
import { useRecipeContext } from '../context/recipes';

interface ILocalState {
  title: string;
  description: string;
  image: string;
  siteName: string;
  url: string;
  loading: boolean;
  error: string | null;
  success: string | null;
}
type Action =
  | IGenericAction<'SET TITLE', string>
  | IGenericAction<'SET DESCRIPTION', string>
  | IGenericAction<'SET IMAGE', string>
  | IGenericAction<'SET SITE NAME', string>
  | IGenericAction<'SET URL', string>
  | IGenericAction<'SET ERROR', string>
  | IGenericAction<'SET SUCCESS', string>
  | IGenericAction<'SUBMIT FORM'>
  | IGenericAction<'RESET FORM'>;

interface ComponentProps {
  onSuccess?: () => void;
  recipeId: string;
}

// form default values
const defaultState: ILocalState = {
  title: '',
  description: '',
  image: '',
  siteName: '',
  url: '',
  loading: false,
  error: null,
  success: null,
};

// form state reducer
const reducer = (state: ILocalState, action: Action) => {
  const newState = getNewState<ILocalState>(state);
  switch (action.type) {
    case 'SET TITLE': {
      newState.title = action.payload;
      return newState;
    }
    case 'SET DESCRIPTION': {
      newState.description = action.payload;
      return newState;
    }
    case 'SET IMAGE': {
      newState.description = action.payload;
      return newState;
    }
    case 'SET SITE NAME': {
      newState.siteName = action.payload;
      return newState;
    }
    case 'SET URL': {
      newState.siteName = action.payload;
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
    case 'SUBMIT FORM': {
      newState.loading = true;
      return newState;
    }
    case 'RESET FORM': {
      return defaultState;
    }
    default: {
      console.error(`Unknown action type:\n${JSON.stringify(action, null, 4)}`);
    }
  }
};

// component
export const RecipeEditForm = ({ onSuccess }: ComponentProps) => {
  const { updateUserData } = useUserContext();
  const {recipes, replaceRecipe} = useRecipeContext(); 
  const [localState, dispatch] = useReducer(reducer, defaultState);
  const { formClass, textFieldClass, btnClass, errorClass } = useStyles();

  useEffect(() => {
    const recipe = recipes.find(item => item._id === )
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: 'SUBMIT FORM' });
    networkRequest({
      url: '/api/v1/recipes',
      method: 'PUT',
      body: {
        email: localState.email,
        password: localState.password,
      },
      success: (json) => {
        updateUserData(json.data);
        dispatch({ type: 'SET SUCCESS', payload: 'Login Successful!' });
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
        disabled={localState.loading}
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
  errorClass: {
    flex: '1 1 100%',
    marginBottom: '20px',
  },
});
