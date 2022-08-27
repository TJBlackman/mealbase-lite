import { FormEvent, useState } from 'react';
import {
  Button,
  Container,
  TextField,
  Alert,
  Toolbar,
  Typography,
  CircularProgress,
  Link as MuiLink,
  Box,
  Grid,
} from '@mui/material';
import { useUserContext } from '@src/contexts/user';
import { useMutation } from 'react-query';
import { networkRequest } from '@src/utils/network-request';
import { addRecipeSchema } from '@src/validation/schemas/recipes';
import Link from 'next/link';
import { RecipeCard } from '@src/components/recipe-card';
import { Recipe } from '@src/db/recipes';

export default function AddRecipePage() {
  const userContext = useUserContext();
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const mutation = useMutation(
    (url: string) =>
      networkRequest<
        Recipe & {
          _id: string;
          isLiked: boolean;
        }
      >({
        url: '/api/recipes/add-recipe',
        method: 'POST',
        body: {
          url,
        },
      }),
    {
      onError: (err) => {
        let msg = 'An unknown error occurred.';
        if (err instanceof Error) {
          msg = err.message;
        }
        setError(msg);
      },
      onSuccess: (data) => {
        setUrl('');
      },
    }
  );

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const validationResult = addRecipeSchema.validate({ url });
    if (validationResult.error) {
      return setError(validationResult.error.message);
    }
    mutation.reset();
    mutation.mutate(url);
  }

  const disabled = !userContext.isLoggedIn || mutation.isLoading;

  if (mutation.isSuccess) {
    console.log('data', mutation.data);
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" component="h1">
        Add New Recipe
      </Typography>
      <Typography variant="body1" paragraph>
        Enter the URL of a recipe online to add it to MealBase.
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          required
          fullWidth
          label="Recipe URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={disabled}
        />
        {error.length > 0 && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        <Toolbar disableGutters>
          <Button type="submit" variant="contained" disabled={disabled}>
            {mutation.isLoading ? (
              <CircularProgress size={20} color="primary" />
            ) : (
              'Submit'
            )}
          </Button>
        </Toolbar>
      </form>
      {mutation.isSuccess && (
        <>
          <Alert severity="success" sx={{ mb: 2 }}>
            Recipe successfully added to MealBase!
          </Alert>
          <Grid container justifyContent="center">
            <RecipeCard recipe={mutation.data} />
          </Grid>
        </>
      )}
      {!userContext.isLoggedIn && (
        <Alert severity="warning">
          To use this feature, you must{' '}
          <Link href="/login" passHref>
            <MuiLink>login</MuiLink>
          </Link>{' '}
          or{' '}
          <Link href="/register" passHref>
            <MuiLink>register an account</MuiLink>
          </Link>
          .
        </Alert>
      )}
    </Container>
  );
}
