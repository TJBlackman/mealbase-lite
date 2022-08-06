import {
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Typography,
  TableContainer,
  Toolbar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { GetServerSideProps } from "next";
import { MealPlansModel } from "@src/db/meal-plans";
import { MealPlanDocument } from "@src/types/index.d";
import { RecipeTableRow } from "@src/components/meal-plans/recipe-table-row";
import { useRefreshServerSideProps } from "@src/hooks/refresh-serverside-props";
import { useState } from "react";
import { InviteUserToMealPlanForm } from "@src/forms/meal-plans/invite-user";

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const props: Record<string, any> = { mealplan: null };
    if (context.params && context.params.id) {
      const mealplan = await MealPlansModel.findById(context.params.id)
        .populate({
          path: "recipes",
          populate: "recipe",
        })
        .lean()
        .catch((err) => {
          console.log(err);
        });
      if (mealplan) {
        // sort recipes so uncooked recipes are first
        mealplan.recipes.sort((item) => (item.isCooked ? 1 : -1));
        props.mealplan = JSON.parse(JSON.stringify(mealplan));
      }
    }

    return { props };
  } catch (error) {
    let msg = "An unknown error occurred.";
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

type Props = {
  mealplan?: MealPlanDocument;
  error?: string;
};

export default function MealPlanDetailsPage(props: Props) {
  const refreshSSPHook = useRefreshServerSideProps({ data: props.mealplan });
  const [showInviteUserDialog, setShowInviteUserDialog] = useState(true);

  function closeDialog() {
    setShowInviteUserDialog(false);
  }

  return (
    <>
      <Typography variant="h5" component="h1" paragraph color="primary">
        {props.mealplan?.title || "Meal Plan Details"}
      </Typography>

      {!props.mealplan && (
        <Typography color="error">Error: Meal plan not found.</Typography>
      )}

      {props.mealplan && (
        <>
          <Divider />
          <TableContainer sx={{ maxWidth: "100vw", overflow: "scroll" }}>
            <Table sx={{ minWidth: "500px" }}>
              <TableHead>
                <TableRow>
                  <TableCell>Recipes</TableCell>
                  <TableCell>Cooked</TableCell>
                  <TableCell>Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.mealplan.recipes.map((item) => (
                  <RecipeTableRow
                    key={item.recipe._id}
                    recipe={item.recipe}
                    isCooked={item.isCooked}
                    mealplanId={props.mealplan!._id}
                    refreshSSP={refreshSSPHook.refreshSSP}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <br />
          <TableContainer sx={{ maxWidth: "100vw", overflow: "scroll" }}>
            <Table sx={{ minWidth: "500px" }}>
              <TableHead>
                <TableRow>
                  <TableCell>Users</TableCell>
                  <TableCell>Permission</TableCell>
                </TableRow>
              </TableHead>
              <TableBody></TableBody>
            </Table>
          </TableContainer>
          <Toolbar disableGutters>
            <Button onClick={() => setShowInviteUserDialog(true)}>
              Invite User
            </Button>
          </Toolbar>
          <Dialog open={showInviteUserDialog} onClose={closeDialog}>
            <DialogTitle>Invite User to Meal Plan</DialogTitle>
            <DialogContent>
              <InviteUserToMealPlanForm
                mealplanId={props.mealplan._id}
                onCancel={closeDialog}
              />
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
}
