import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  Link as MuiLink,
} from '@mui/material';
import { RecipeDocument } from '@src/types';
import React, { useState } from 'react';

type Props = {
  recipe: RecipeDocument;
  isCooked: boolean;
};

export const RecipeListItem = (props: Props) => {
  const [isCooked, setIsCooked] = useState(props.isCooked);

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
        <Checkbox checked={isCooked} />
      </ListItemSecondaryAction>
    </ListItem>
  );
};
