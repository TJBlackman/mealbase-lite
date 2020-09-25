import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { IRecipe } from '../types';
import { RecipeCard } from '../components/recipe-card';
import { networkRequest } from '../utils/network-request';
import { Alert } from '@material-ui/lab';
import { useRecipeContext } from '../context/recipes';

interface IProps {
  onClose: () => void;
  data: IRecipe;
}

export const DeleteRecipeModal = ({ onClose, data }: IProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { dismissRecipeFromUI } = useRecipeContext();
  const deleteRecipe = () => {
    setLoading(true);
    networkRequest({
      url: '/api/v1/recipes',
      method: 'DELETE',
      body: {
        _id: data._id,
      },
      success: () => {
        setSuccess(true);
        dismissRecipeFromUI(data);
        setTimeout(onClose, 2000);
      },
      error: (error) => {
        setLoading(false);
        setError(error.message);
      },
    });
  };
  return (
    <div>
      <Dialog open={true} onClose={onClose} scroll='paper'>
        <DialogTitle color='primary'>Delete this recipe?</DialogTitle>
        <DialogContent dividers={true}>
          <RecipeCard recipe={data} />
        </DialogContent>
        {error && (
          <Alert severity='error' elevation={2} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity='success' elevation={2}>
            Recipe Successfully Deleted!
          </Alert>
        )}
        <DialogActions style={{ justifyContent: 'space-between' }}>
          <Button onClick={onClose} color='primary' disabled={loading}>
            Cancel
          </Button>
          <Button onClick={deleteRecipe} color='primary' disabled={loading} variant='contained'>
            Yes, Delete Recipe
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
