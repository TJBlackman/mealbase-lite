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
import { MealPlansModel, MealPlanPermissions } from "@src/db/meal-plans";
import { Recipe } from "@src/db/recipes";
import { RecipeTableRow } from "@src/components/meal-plans/recipe-table-row";
import { useRefreshServerSideProps } from "@src/hooks/refresh-serverside-props";
import { useState } from "react";
import { InviteUserToMealPlanForm } from "@src/forms/meal-plans/invite-user";
import { RecipeModel } from "@src/db/recipes";
import { UserModel } from "@src/db/users";
import { InvitationModel } from "@src/db/invites";

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const props: Record<string, any> = { mealplan: null };
    if (context.params && context.params.id) {
      const mealplan = await MealPlansModel.findById<MealPlan>(
        context.params.id
      )
        .populate({
          path: "owner",
          select: { email: 1 },
          model: UserModel,
        })
        .populate({
          path: "recipes.recipe",
          model: RecipeModel,
        })
        .populate({
          path: "members.member",
          select: "email",
          model: UserModel,
        })
        .populate({
          path: "invites.invitee",
          select: "email",
          model: InvitationModel,
        })
        .lean()
        .catch((err) => {
          console.log(err);
        });
      if (mealplan) {
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
  mealplan?: MealPlan;
  error?: string;
};

export default function MealPlanDetailsPage(props: Props) {
  console.log("props", JSON.stringify(props.mealplan, null, 2));
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

/**
 * Describes the shape of the data returned by getServerSideProps
 */
interface MealPlan {
  _id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  recipes: {
    recipe: Recipe & { _id: string };
    isCooked: boolean;
  }[];
  members: {
    member: {
      _id: string;
      email: string;
    };
    permissions: MealPlanPermissions[];
  }[];
  invites: {
    invitee: {
      email: string;
      _id: string;
    };
    permissions: MealPlanPermissions[];
  }[];
  owner: {
    _id: string;
    email: string;
  };
}
