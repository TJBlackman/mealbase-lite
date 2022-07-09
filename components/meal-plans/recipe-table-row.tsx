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
} from "@mui/material";
import { useToggleRecipeIsCookedMutation } from "@src/mutations/meal-plans/toggle-recipe-is-cooked";
import { RecipeDocument } from "@src/types";
import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";

type Props = {
  mealplanId: string;
  recipe: RecipeDocument;
  isCooked: boolean;
};

export const RecipeTableRow = (props: Props) => {
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
    <TableRow>
      <TableCell>
        <Grid container spacing={1}>
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
        {toggleRecipeMutation.isLoading ? (
          <span style={{ marginLeft: "10px" }}>
            <CircularProgress size={24} />
          </span>
        ) : (
          <Checkbox checked={isCooked} onChange={toggleRecipe} />
        )}
      </TableCell>
      <TableCell>
        <IconButton>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};
