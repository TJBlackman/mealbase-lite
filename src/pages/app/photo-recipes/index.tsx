import {
  Typography,
  DialogContent,
  LinearProgress,
  Link as MuiLink,
  Grid,
  Button,
} from "@mui/material";
import { PhotoRecipeModel, PhotoRecipe } from "@src/db/photo-recipes";
import { useState } from "react";
import { mongoDbConnection } from "@src/db/connection";
import { getUserJWT } from "@src/validation/server-requests";
import { GetServerSideProps } from "next";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useRefreshServerSideProps } from "@src/hooks/refresh-serverside-props";
import { UserModel } from "@src/db/users";

// get server side data
export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    // get userJWT, if user is logged in
    const user = await getUserJWT(context.req.cookies);
    if (!user) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    // connect to db
    await mongoDbConnection();

    // find users photo recipes, or photo recipes they're a member of
    const photoRecipes = await PhotoRecipeModel.find({
      $or: [{ owner: user._id }, { members: user._id }],
    })
      .populate({
        path: "owner",
        select: "email",
        model: UserModel,
      })
      .populate({
        path: "members",
        select: "email",
        model: UserModel,
      })
      .lean();

    return {
      props: {
        photoRecipes: JSON.parse(JSON.stringify(photoRecipes)),
      },
    };
  } catch (err) {
    console.log(err);
    let msg = "An unknown error occurred.";
    if (err instanceof Error) {
      msg = err.message;
    }
    return { props: { mealplans: [], count: 0, error: msg } };
  }
};

type Props = {
  photoRecipes: PhotoRecipe & { _id: string }[];
  error?: string;
};

export default function MealPlansPage(props: Props) {
  console.log(props);
  const [isVisible, setIsVisible] = useState(false);
  const { refreshSSP, isLoading } = useRefreshServerSideProps({ data: props });

  return (
    <>
      <Grid container spacing={2} alignItems="flex-end" sx={{ mb: 2 }}>
        <Grid item>
          <Typography variant="h5" component="h1">
            Meal Plans
          </Typography>
          <Typography sx={{ maxWidth: "md" }}>
            A meal plan is a small collection of the recipes to help you plan
            what meals you want to cook in the near future. Use this page to
            create and manage all your Meal plans!
          </Typography>
        </Grid>
        <Grid item>
          <Button onClick={() => setIsVisible(true)} variant="outlined">
            Create New Meal Plan
          </Button>
        </Grid>
      </Grid>

      {props.error && (
        <Typography color="error">Error: {props.error}</Typography>
      )}
    </>
  );
}
