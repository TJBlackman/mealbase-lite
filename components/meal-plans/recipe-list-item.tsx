import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  Link as MuiLink,
} from '@mui/material';
import { useRefreshServerSideProps } from '@src/hooks/refresh-serverside-props';
import { useToggleRecipeIsCookedMutation } from '@src/mutations/meal-plans/toggle-recipe-is-cooked';
import { RecipeDocument } from '@src/types';
import React, { useState } from 'react';

type Props = {
  mealplanId: string;
  recipe: RecipeDocument;
  isCooked: boolean;
};

export const RecipeListItem = (props: Props) => {
  const [isCooked, setIsCooked] = useState(props.isCooked);
  const toggleRecipeMutation = useToggleRecipeIsCookedMutation();

  function toggleRecipe() {
    toggleRecipeMutation.mutate(
      { mealplanId: props.mealplanId, recipeId: props.recipe._id },
      {
        onSuccess: (response) => {
          setIsCooked(response.isCooked);
        },
      }
    );
  }

  return (
    <ListItem
      key={props.recipe._id}
      sx={{ filter: `grayscale(${isCooked ? 1 : 0})` }}
    >
      <ListItemAvatar>
        <Avatar
          alt={props.recipe.title}
          src={props.recipe.image}
          variant="rounded"
        />
      </ListItemAvatar>
      <ListItemText
        primary={
          <MuiLink href={props.recipe.url + props.recipe.hash} target="_blank">
            {props.recipe.title}
          </MuiLink>
        }
        secondary={props.recipe.siteName}
      />
      <ListItemSecondaryAction>
        <Checkbox
          checked={isCooked}
          onChange={toggleRecipe}
          disabled={toggleRecipeMutation.isLoading}
        />
      </ListItemSecondaryAction>
    </ListItem>
  );
};
