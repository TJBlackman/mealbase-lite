import {
  Typography,
  TextField,
  Toolbar,
  Button,
  CircularProgress,
} from '@mui/material';
import { useMealPlanCountQuery } from '@src/queries/meal-plan-count';
import { networkRequest } from '@src/utils/network-request';
import { FormEvent, useEffect, useState } from 'react';
import { useMutation } from 'react-query';

type Props = {
  onSuccess?: () => void;
};

export function CreateMealPlanForm(props: Props) {
  const [title, setTitle] = useState('');
  const countQuery = useMealPlanCountQuery();

  const mutation = useMutation(
    (payload: { title: string }) =>
      networkRequest({
        url: '/api/meal-plans/new',
        method: 'POST',
        body: payload,
      }),
    {
      onSuccess: () => {
        props.onSuccess?.();
      },
    }
  );

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    mutation.mutate({ title });
  }

  const disabled = countQuery.isLoading || mutation.isLoading;

  useEffect(() => {
    if (countQuery.isSuccess) {
      setTitle(`Meal Plan #${countQuery.data.count + 1}`);
    }
  }, [countQuery.dataUpdatedAt]);

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="body1" paragraph>
        Start by giving your new meal plan. After it has been saved, you can add
        recipes to your meal plan, and invite other users to view or edit your
        meal plan.
      </Typography>
      <TextField
        fullWidth
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={disabled}
        sx={{ mb: 2 }}
      />
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
