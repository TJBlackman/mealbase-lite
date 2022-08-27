import { RecipeModel } from '@src/db/recipes';
import { Recipe } from '@src/db/recipes';
import { GetServerSideProps } from 'next';
import {
  Typography,
  Container,
  Alert,
  TextField,
  FormControlLabel,
  Checkbox,
  Grid,
  Toolbar,
  Button,
  CircularProgress,
} from '@mui/material';
import { useState, FormEvent, useEffect } from 'react';
import { RecipeCard } from '@src/components/recipe-card';
import { useMutation } from 'react-query';
import { networkRequest } from '@src/utils/network-request';
import { useRouter } from 'next/router';
import { red } from '@mui/material/colors';

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const props: Record<string, any> = {};
    if (context.params && context.params.id) {
      const recipe = await RecipeModel.findById(context.params.id).lean();
      if (recipe) {
        props.recipe = {
          ...recipe,
          _id: recipe._id.toString(),
          createdAt: recipe.createdAt.toString(),
          updatedAt: recipe.updatedAt.toString(),
          addedByUser: recipe.addedByUser.toString(),
        };
      }
    }

    return { props };
  } catch (error) {
    let msg = 'An unknown error occurred.';
    if (error instanceof Error) {
      msg = error.message;
    }
    return {
      props: {
        error: msg,
      },
    };
  }
};

type RecipeWithId = Recipe & { _id: string };

type Props = {
  recipe?: RecipeWithId;
  error?: string;
};
export default function DeleteRecipePage(props: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(props.recipe?.title || '');
  const [description, setDescription] = useState(
    props.recipe?.description || ''
  );
  const [img, setImg] = useState(props.recipe?.image || '');
  const [url, setUrl] = useState(props.recipe?.url || '');
  const [hash, setHash] = useState(props.recipe?.hash || '');
  const [siteName, setSiteName] = useState(props.recipe?.siteName || '');
  const [deleted, setDeleted] = useState<boolean>(
    props.recipe?.deleted || false
  );

  // API mutation
  const mutation = useMutation(
    (
      payload: Pick<
        RecipeWithId,
        | 'url'
        | 'title'
        | 'image'
        | 'deleted'
        | 'siteName'
        | 'description'
        | '_id'
      >
    ) =>
      networkRequest({
        url: `/api/recipes/edit`,
        method: 'PUT',
        body: payload,
      })
  );

  // handle form submit
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    mutation.mutate(
      {
        _id: props.recipe!._id,
        title,
        description,
        image: img,
        url,
        siteName,
        deleted,
      },
      {
        onSuccess: () => {
          router.replace(router.asPath);
        },
      }
    );
  }

  function reset() {
    setTitle(props.recipe?.title || '');
    setDescription(props.recipe?.description || '');
    setImg(props.recipe?.image || '');
    setUrl(props.recipe?.url || '');
    setSiteName(props.recipe?.siteName || '');
    setDeleted(props.recipe?.deleted || false);
    setHash(props.recipe?.hash || '');
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h5" component="h1" paragraph>
        Edit Recipe
      </Typography>
      {props.error && <Alert severity="error">Error: {props.error}</Alert>}
      {!props.error && !props.recipe && (
        <Alert severity="warning">No such recipe exists.</Alert>
      )}
      {props.recipe && (
        <Grid container spacing={2} alignItems="flex-start">
          <Grid item xs={12} sm={6}>
            <form onSubmit={handleSubmit}>
              <TextField
                sx={{ mb: 2 }}
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                variant="outlined"
              />
              <TextField
                sx={{ mb: 2 }}
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                variant="outlined"
                multiline
                maxRows={5}
                minRows={2}
              />
              <TextField
                sx={{ mb: 2 }}
                label="Image URL"
                value={img}
                onChange={(e) => setImg(e.target.value)}
                fullWidth
                variant="outlined"
              />
              <TextField
                sx={{ mb: 2 }}
                label="Recipe URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                fullWidth
                variant="outlined"
              />
              <TextField
                sx={{ mb: 2 }}
                label="Hash"
                value={hash}
                onChange={(e) => setHash(e.target.value)}
                fullWidth
                variant="outlined"
              />
              <TextField
                sx={{ mb: 2 }}
                label="Site Name"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                fullWidth
                variant="outlined"
              />
              <FormControlLabel
                sx={{ mb: 2 }}
                control={
                  <Checkbox
                    checked={deleted}
                    onChange={(e) => setDeleted(e.target.checked)}
                    sx={{
                      color: red[800],
                      '&.Mui-checked': {
                        color: red[600],
                      },
                    }}
                  />
                }
                label={
                  <Typography color="error">
                    {deleted ? 'Deleted' : 'Delete'}
                  </Typography>
                }
              />
              {mutation.isError && (
                <Alert severity="error">An error occurred.</Alert>
              )}
              <Toolbar disableGutters>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ mr: 2 }}
                  disabled={mutation.isLoading}
                >
                  {mutation.isLoading ? (
                    <CircularProgress size={20} color="primary" />
                  ) : (
                    'Submit'
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={reset}
                  disabled={mutation.isLoading}
                >
                  Reset
                </Button>
              </Toolbar>
              {mutation.isSuccess && <Alert severity="success">Success!</Alert>}
            </form>
          </Grid>
          <Grid item xs={12} sm={6} container justifyContent="center">
            <RecipeCard
              recipe={{
                ...props.recipe,
                title,
                description,
                image: img,
                url,
                siteName,
                deleted,
                isLiked: false,
              }}
              isPreview
            />
          </Grid>
        </Grid>
      )}
    </Container>
  );
}
