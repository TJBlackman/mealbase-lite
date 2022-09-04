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

    // get meal plans this user is a member of
    const photoRecipes = await PhotoRecipeModel.find({
      owner: user._id,
    })
      .populate({
        path: "owner",
        select: { email: 1 },
        model: UserModel,
      })
      .sort({ createdAt: -1 })
      .limit(25)
      .lean();
    const count = await PhotoRecipeModel.find({
      owner: user._id,
    }).count();

    return {
      props: {
        photoRecipes: JSON.parse(JSON.stringify(photoRecipes)),
        count,
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
  count: number;
  error?: string;
};

export default function MealPlansPage(props: Props) {
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

      <DataGrid
        pageSize={100}
        columns={columns}
        loading={isLoading}
        rows={props.mealplans}
        sx={{ height: "65vh" }}
        disableSelectionOnClick
        rowsPerPageOptions={[100]}
        getRowId={(data) => data._id}
        columnVisibilityModel={{ _id: false }}
        components={{
          NoRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              No meal plans created yet!
            </Stack>
          ),
          LoadingOverlay: LinearProgress,
        }}
      />
    </>
  );
}
