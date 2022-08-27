import {
  TextField,
  Typography,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Button,
  CircularProgress,
  Toolbar,
} from "@mui/material";
import { useInviteUserToMealplanMutation } from "@src/mutations/meal-plans/invite-user";
import { MealPlanPermissions } from "@src/db/meal-plans";
import React, { FormEvent, useState } from "react";

type Props = {
  mealplanId: string;
  onCancel?: () => void;
};

export const InviteUserToMealPlanForm = (props: Props) => {
  const [email, setEmail] = useState("");
  const [permissions, setPermissions] = useState<MealPlanPermissions[]>([]);
  const mutation = useInviteUserToMealplanMutation();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    mutation.mutate({
      email,
      mealplanId: props.mealplanId,
      permissions: permissions,
    });
  }

  // either add or remove the permission
  function handleCheckbox(e: React.ChangeEvent<HTMLInputElement>) {
    const isChecked = e.target.checked;
    const value = e.target.value;
    if (isChecked) {
      const newState = [...permissions, value] as MealPlanPermissions[];
      setPermissions(newState);
    } else {
      const newState = permissions.filter((i) => i !== value);
      setPermissions(newState);
    }
  }

  console.log("permissions", permissions);

  return (
    <form onSubmit={handleSubmit}>
      <Typography paragraph>
        Invite another person to be a part of this meal plan, and designate what
        actions they can take.
      </Typography>
      <TextField
        fullWidth
        size="small"
        value={email}
        label="Email Address"
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mb: 2 }}
      />
      <FormControlLabel
        control={
          <Checkbox
            value={MealPlanPermissions.CompleteRecipes}
            onChange={handleCheckbox}
          />
        }
        sx={{ display: "block" }}
        label="Can mark recipes as complete."
      />
      <FormControlLabel
        control={
          <Checkbox
            value={MealPlanPermissions.EditRecipes}
            onChange={handleCheckbox}
          />
        }
        sx={{ display: "block" }}
        label="Can add/remove recipes."
      />
      <FormControlLabel
        control={
          <Checkbox
            value={MealPlanPermissions.EditMembers}
            onChange={handleCheckbox}
          />
        }
        sx={{ display: "block" }}
        label="Can add/remove users."
      />
      <Toolbar disableGutters>
        <Button
          type="submit"
          variant="contained"
          sx={{ mr: 2 }}
          disabled={mutation.isLoading || mutation.isSuccess}
        >
          {mutation.isLoading ? (
            <CircularProgress size={20} color="primary" />
          ) : (
            "Save"
          )}
        </Button>
        {props.onCancel && <Button onClick={props.onCancel}>Cancel</Button>}
      </Toolbar>
    </form>
  );
};
