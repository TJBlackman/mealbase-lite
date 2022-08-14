import {
  Avatar,
  Checkbox,
  Link as MuiLink,
  CircularProgress,
  TableRow,
  TableCell,
  Grid,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Toolbar,
  Button,
} from '@mui/material';
import { Recipe } from '@src/db/recipes';
import React, { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDeleteRecipeFromMealpanMutation } from '@src/mutations/meal-plans/delete-recipe';
import { useMutation } from 'react-query';
import { networkRequest } from '@src/utils/network-request';

type Props = {
  mealplanId: string;
  recipe: Recipe & { _id: string };
  isCooked: boolean;
  refreshSSP: () => void;
};

export const RecipeTableRow = (props: Props) => {
  const [dialogIsVisible, setDialogIsVisible] = useState(false);
  const [isCooked, setIsCooked] = useState(props.isCooked);
  const deleteRecipeMutation = useDeleteRecipeFromMealpanMutation();

  // recipe is cooked mutation
  const recipeIsCookedMutation = useMutation(() => {
    const status = isCooked ? 'uncooked' : 'cooked';
    return networkRequest<{ isCooked: boolean }>({
      method: 'PUT',
      url: `/api/meal-plans/${props.mealplanId}/recipe-is-${status}/${props.recipe._id}`,
    });
  });

  function toggleRecipe() {
    recipeIsCookedMutation.mutate(void 0, {
      onSuccess: (response) => {
        setIsCooked(response.isCooked);
      },
    });
  }

  function deleteRecipe() {
    deleteRecipeMutation.mutate(
      { mealplanId: props.mealplanId, recipeId: props.recipe._id },
      {
        onSuccess: (response) => {
          setDialogIsVisible(false);
          props.refreshSSP();
        },
      }
    );
  }

  return (
    <>
      <TableRow>
        <TableCell>
          <Grid
            container
            spacing={1}
            wrap="nowrap"
            sx={{ filter: isCooked ? 'grayscale(1)' : 'none' }}
          >
            <Grid item>
              <Avatar
                alt={props.recipe.title}
                src={props.recipe.image}
                variant="rounded"
              />
            </Grid>
            <Grid item>
              <MuiLink
                href={props.recipe.url + props.recipe.hash}
                target="_blank"
              >
                {props.recipe.title}
              </MuiLink>
              <Typography variant="body2" color="textSecondary">
                {props.recipe.siteName}
              </Typography>
            </Grid>
          </Grid>
        </TableCell>
        <TableCell>
          {recipeIsCookedMutation.isLoading ? (
            <span style={{ marginLeft: '10px' }}>
              <CircularProgress size={24} />
            </span>
          ) : (
            <Checkbox checked={isCooked} onChange={toggleRecipe} />
          )}
        </TableCell>
        <TableCell>
          <IconButton onClick={() => setDialogIsVisible(true)}>
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <Dialog open={dialogIsVisible} onClose={() => setDialogIsVisible(false)}>
        <DialogTitle color="error">Delete Recipe from Mealplan</DialogTitle>
        <DialogContent>
          <Typography paragraph>
            Are you sure you want to delete this recipe from your mealplan?
          </Typography>
          <Grid container spacing={1} wrap="nowrap">
            <Grid item>
              <Avatar
                alt={props.recipe.title}
                src={props.recipe.image}
                variant="rounded"
              />
            </Grid>
            <Grid item>
              <MuiLink
                href={props.recipe.url + props.recipe.hash}
                target="_blank"
              >
                {props.recipe.title}
              </MuiLink>
              <Typography variant="body2" color="textSecondary">
                {props.recipe.siteName}
              </Typography>
            </Grid>
          </Grid>
          <br />
          <Toolbar disableGutters sx={{ flexDirection: 'row-reverse' }}>
            <Button
              color="error"
              variant="contained"
              sx={{ ml: 2 }}
              onClick={deleteRecipe}
              disabled={deleteRecipeMutation.isLoading}
            >
              {deleteRecipeMutation.isLoading ? (
                <CircularProgress size={20} color="error" />
              ) : (
                'Delete'
              )}
            </Button>
            <Button onClick={() => setDialogIsVisible(false)}>Cancel</Button>
          </Toolbar>
        </DialogContent>
      </Dialog>
    </>
  );
};
