import React, { useReducer } from 'react';
import { IGenericAction, IRecipe } from '../types';
import { getNewState } from '../utils/copy-state';
import { makeStyles } from '@material-ui/styles';
import { Button, Grid, FormControl, InputLabel, Select, MenuItem, Typography } from '@material-ui/core';
import { networkRequest } from '../utils/network-request';
import { Alert } from '@material-ui/lab';
import { useUserContext } from '../context/user';
import { useCookbookContext } from '../context/cookbooks';

// styles
const useStyles = makeStyles({
  formClass: {
    padding: '0px',
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
  cookbookId: string;
  loading: boolean;
  success: string | null;
  error: string | null;
}
const defaultState: IState = {
  cookbookId: '',
  loading: false,
  success: null,
  error: null,
};

type Actions =
  | IGenericAction<'SET LOADING', boolean>
  | IGenericAction<'SET ERROR', string | null>
  | IGenericAction<'SET SUCCESS', string | null>
  | IGenericAction<'SET COOKBOOK', string>
  | IGenericAction<'RESET FORM'>
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
    case 'SET COOKBOOK': {
      newState.cookbookId = action.payload;
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
  recipe: IRecipe;
}

export const AddRecipeToCookbookForm = ({ onSuccess, recipe }: IProps) => {
  const { user } = useUserContext();
  const { cookbooks, addRecipeToCookbook } = useCookbookContext();
  const [localState, dispatch] = useReducer(reducer, defaultState);
  const { formClass, textFieldClass, btnClass, errorClass } = useStyles();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch({ type: 'SUBMIT FORM' });
    networkRequest({
      url: '/api/v1/cookbooks/add-recipe',
      method: 'POST',
      body: {
        recipeId: recipe._id,
        cookbookId: localState.cookbookId,
      },
      success: (response) => {
        addRecipeToCookbook({
          cookbookId: localState.cookbookId,
          recipeId: recipe._id,
        });
        dispatch({ type: 'SET SUCCESS', payload: 'Recipe added to cookbook!' });
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
      <Typography variant='body1'>Add this recipe:</Typography>
      <Typography variant='h6' paragraph color='primary'>
        {recipe.title}
      </Typography>

      <Typography variant='body1'>To this cookbook:</Typography>
      <FormControl variant='outlined' fullWidth className={textFieldClass}>
        <InputLabel id='select-cookbook'>Select Cookbook</InputLabel>
        <Select
          labelId='select-cookbook'
          value={localState.cookbookId}
          onChange={(e: React.ChangeEvent<{ value: string }>) =>
            dispatch({ type: 'SET COOKBOOK', payload: e.target.value })
          }
          label='Select Cookbook'
          fullWidth
          disabled={disabled}
        >
          <MenuItem value=''>
            <em>Select Cookbook</em>
          </MenuItem>
          {cookbooks.map((cb) => (
            <MenuItem value={cb._id} key={cb._id}>
              {cb.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

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
          You must have an account to add recipes to cookbooks.
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
