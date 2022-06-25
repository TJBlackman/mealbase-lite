import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
  MenuItem,
  Button,
  Toolbar,
} from "@mui/material";
import { useMealPlansQuery } from "@src/queries/meal-plans";
import { RecipeDocument } from "@src/types";
import React, { useState, useEffect } from "react";

/**
 * When a user wants to add a recipe to a meal plan,
 * this modal should appear (fullscreen on mobile).
 * The user can add the recipe to an existing mealplan,
 * or add it to a newly created mealplan.
 */

const CREATE_NEW_MEALPLAN = "CREATE NEW MEALPLAN";

type Props = {
  open: boolean;
  recipe: RecipeDocument;
  onClose: () => void;
};

export const AddRecipeToMealplanDialog = (props: Props) => {
  const mealplansQuery = useMealPlansQuery();
  const [selectedMealplan, setSelectedMealplan] = useState("");
  const [mealplanTitle, setMealplanTitle] = useState("");

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

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogContent>
        {mealplansQuery.isLoading && <CircularProgress />}
        {mealplansQuery.isError && (
          <Typography color="error">
            An error has occurred; {mealplansQuery.error as string}
          </Typography>
        )}
        {mealplansQuery.isSuccess && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6">Add Recipe to Meal Plan</Typography>
              <Typography paragraph color="textSecondary">
                Add the recipe to an existing meal plan, or create a new meal
                plan.
              </Typography>
              <Typography color="primary" paragraph>
                {props.recipe.title}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                variant="outlined"
                label="Select Meal Plan"
                value={selectedMealplan}
                onChange={(e) => setSelectedMealplan(e.target.value)}
              >
                {mealplansQuery.data.map((mealplan) => (
                  <MenuItem key={mealplan._id} value={mealplan._id}>
                    {mealplan.title}
                  </MenuItem>
                ))}
                <MenuItem value={CREATE_NEW_MEALPLAN}>
                  Create new Mealplan
                </MenuItem>
              </TextField>
            </Grid>
            {selectedMealplan === CREATE_NEW_MEALPLAN && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="standard"
                  value={mealplanTitle}
                  label="New Meal Plan Title"
                  onChange={(e) => setMealplanTitle(e.target.value)}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <Toolbar disableGutters>
                <Button type="submit" variant="contained" sx={{ mr: 2 }}>
                  {mealplansQuery.isLoading ? (
                    <CircularProgress size={20} color="primary" />
                  ) : (
                    "Save"
                  )}
                </Button>
                <Button
                  variant="contained"
                  type="button"
                  color="inherit"
                  disabled={mealplansQuery.isLoading}
                >
                  Cancel
                </Button>
              </Toolbar>
            </Grid>
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
};
