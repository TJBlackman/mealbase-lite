import {
  Typography,
  TextField,
  Toolbar,
  Button,
  CircularProgress,
  MenuItem,
} from '@mui/material';
import { useMealPlansQuery } from '@src/queries/meal-plans';
import { RecipeDocument } from '@src/types';
import { networkRequest } from '@src/utils/network-request';
import { FormEvent, useEffect, useState } from 'react';
import { useMutation } from 'react-query';

const CREATE_NEW_MEALPLAN = 'CREATE NEW MEALPLAN';
type Props = {
  recipe: RecipeDocument;
};

export function AddRecipeToMealPlanForm(props: Props) {
  const mealplansQuery = useMealPlansQuery();
  const [selectedMealplan, setSelectedMealplan] = useState('');
  const [mealplanTitle, setMealplanTitle] = useState('');

  // set the default name for a new mealplan, if it has not been updated yet
  // also, set the value of Select to be the first mealplan (most recent mealplan)
  useEffect(() => {
    if (mealplansQuery.isSuccess) {
      if (!mealplanTitle) {
        setMealplanTitle(`Meal Plan #${mealplansQuery.data.length + 1}`);
      }
      if (!selectedMealplan) {
        setSelectedMealplan(mealplansQuery.data[0]._id);
      }
    }
  }, [mealplansQuery.dataUpdatedAt]);

  const mutation = useMutation((payload: { title: string }) =>
    networkRequest({
      url: '/api/meal-plans/new',
      method: 'POST',
      body: payload,
    })
  );

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // mutation.mutate({ title });
  }

  const disabled = mealplansQuery.isLoading || mutation.isLoading;

  // return loading state while loading
  if (mealplansQuery.isLoading) {
    return <CircularProgress />;
  }

  // return error state while error
  if (mealplansQuery.isError) {
    return (
      <Typography color="error">
        An error has occurred; {mealplansQuery.error as string}
      </Typography>
    );
  }

  // else, show form
  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h6">Add Recipe to Meal Plan</Typography>
      <Typography paragraph color="textSecondary">
        Add this recipe to an existing meal plan, or create a new meal plan.
      </Typography>
      <Typography color="primary" paragraph>
        {props.recipe.title}
      </Typography>
      <TextField
        select
        fullWidth
        variant="outlined"
        label="Select Meal Plan"
        value={selectedMealplan}
        onChange={(e) => setSelectedMealplan(e.target.value)}
        sx={{ mb: 2 }}
      >
        {mealplansQuery.data!.map((mealplan) => (
          <MenuItem key={mealplan._id} value={mealplan._id}>
            {mealplan.title}
          </MenuItem>
        ))}
        <MenuItem value={CREATE_NEW_MEALPLAN}>Create new Mealplan</MenuItem>
      </TextField>
      {selectedMealplan === CREATE_NEW_MEALPLAN && (
        <TextField
          fullWidth
          variant="standard"
          value={mealplanTitle}
          label="New Meal Plan Title"
          onChange={(e) => setMealplanTitle(e.target.value)}
          sx={{ mb: 1 }}
        />
      )}
      <Toolbar disableGutters>
        <Button
          type="submit"
          variant="contained"
          sx={{ mr: 2 }}
          disabled={disabled}
        >
          {disabled ? <CircularProgress size={20} color="primary" /> : 'Save'}
        </Button>
      </Toolbar>
    </form>
  );
}
