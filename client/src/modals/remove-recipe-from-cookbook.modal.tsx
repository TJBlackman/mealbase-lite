import React, { useReducer } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from '@material-ui/core';
import { IRecipe, IGenericAction } from '../types';
import { getNewState } from '../utils/copy-state';
import { useCookbookContext } from '../context/cookbooks';
import { useRecipeContext } from '../context/recipes';
import { networkRequest } from '../utils/network-request';
import { FormFeedback } from '../components/form-feedback';
import { makeStyles } from '@material-ui/core/styles';

interface IProps {
  onClose: () => void;
  data: {
    recipe: IRecipe;
    cookbookId: string;
  };
}

type Action =
  | IGenericAction<'SUBMIT NETWORK REQUEST'>
  | IGenericAction<'SET SUCCESS', string>
  | IGenericAction<'SET ERROR', string>;

interface ILocalState {
  loading: boolean;
  success: string;
  error: string;
}

const defaultState: ILocalState = {
  loading: false,
  success: '',
  error: '',
};

const reducer = (state: ILocalState, action: Action) => {
  const newState = getNewState<ILocalState>(state);
  switch (action.type) {
    case 'SUBMIT NETWORK REQUEST': {
      newState.error = '';
      newState.success = '';
      newState.loading = true;
      return newState;
    }
    case 'SET ERROR': {
      newState.loading = false;
      newState.error = action.payload;
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

export const RemoveRecipeFromCookbookModal = ({ onClose, data }: IProps) => {
  const [localState, dispatch] = useReducer(reducer, defaultState);
  const { cookbooks } = useCookbookContext();
  const { dismissRecipeFromUI } = useRecipeContext();
  const cookbook = cookbooks.find((i) => i._id === data.cookbookId);
  const styles = useStyles();

  if (!cookbook) {
    console.error("Can't remove recipe from undefined cookbook.");
    onClose();
    return null;
  }

  const removeRecipe = () => {
    dispatch({ type: 'SUBMIT NETWORK REQUEST' });
    networkRequest({
      url: '/api/v1/cookbooks/remove-recipe',
      method: 'POST',
      body: {
        cookbookId: cookbook._id,
        recipeId: data.recipe._id,
      },
      success: () => {
        dispatch({ type: 'SET SUCCESS', payload: 'Recipe successfully removed from this cookbook!' });
        dismissRecipeFromUI(data.recipe);
        setTimeout(onClose, 3000);
      },
      error: (err) => {
        dispatch({ type: 'SET ERROR', payload: err.message });
      },
      latency: 5000,
    });
  };

  return (
    <Dialog open={true} onClose={onClose} scroll='paper'>
      <DialogTitle color='primary'>Remove Recipe From Cookbook</DialogTitle>
      <DialogContent dividers={true}>
        <Typography variant='body1'>
          Are you sure you want to <b>remove</b> this recipe:
        </Typography>
        <Typography variant='h6' color='primary' paragraph>
          {data.recipe.title}
        </Typography>
        <Typography variant='body1'>from this cookbook?</Typography>
        <Typography variant='h6' color='primary' paragraph>
          {cookbook.title}
        </Typography>
        <FormFeedback
          success={localState.success}
          error={localState.error}
          clearError={() => dispatch({ type: 'SET ERROR', payload: '' })}
        />
        <Grid container justify='flex-end' alignItems='center'>
          <Button disabled={localState.loading} onClick={onClose}>
            Cancel
          </Button>
          <Button variant='contained' disabled={localState.loading} onClick={removeRecipe} className={styles.deleteBtn}>
            Remove Recipe
          </Button>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary'>
          Dismiss
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const useStyles = makeStyles((theme) => ({
  deleteBtn: {
    backgroundColor: theme.palette.error.dark,
    color: theme.palette.error.contrastText,
  },
}));
