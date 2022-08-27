import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  LinearProgress,
  Link as MuiLink,
  Grid,
} from '@mui/material';
import { MealPlansModel, MealPlan } from '@src/db/meal-plans';
import { useState } from 'react';
import { CreateMealPlanForm } from '@src/forms/meal-plans/create';
import { mongoDbConnection } from '@src/db/connection';
import { getUserJWT } from '@src/validation/server-requests';
import { GetServerSideProps } from 'next';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useRefreshServerSideProps } from '@src/hooks/refresh-serverside-props';
import Link from 'next/link';
import { UserModel } from '@src/db/users';

// get server side data
export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    // get userJWT, if user is logged in
    const user = await getUserJWT(context.req.cookies);
    if (!user) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    // connect to db
    await mongoDbConnection();

    // get meal plans this user is a member of
    const mealplans = await MealPlansModel.find({
      $or: [{ owner: user._id }, { 'members.member': user._id }],
    })
      .populate({
        path: 'owner',
        select: { email: 1 },
        model: UserModel,
      })
      .sort({ createdAt: -1 })
      .limit(25)
      .lean();
    const count = await MealPlansModel.find({
      $or: [{ owner: user._id }, { 'members.member': user._id }],
    }).count();

    return {
      props: {
        mealplans: JSON.parse(JSON.stringify(mealplans)),
        count,
      },
    };
  } catch (err) {
    console.log(err);
    let msg = 'An unknown error occurred.';
    if (err instanceof Error) {
      msg = err.message;
    }
    return { props: { mealplans: [], count: 0, error: msg } };
  }
};

type Props = {
  mealplans: MealPlan & { _id: string }[];
  count: number;
  error?: string;
};

/**
 * Define table columns
 */
const columns: GridColDef[] = [
  {
    field: '_id',
    headerName: '_id',
    width: 230,
  },
  {
    field: 'title',
    headerName: 'Title',
    minWidth: 250,
    flex: 1,
    renderCell: (props) => {
      return (
        <Link href={`/app/meal-plans/${props.row._id}`}>
          <MuiLink sx={{ cursor: 'pointer' }}>{props.value}</MuiLink>
        </Link>
      );
    },
  },
  {
    field: 'recipes',
    headerName: 'Recipes',
    width: 100,
    valueGetter: (data) => data.value.length,
  },
  {
    field: 'createdAt',
    headerName: 'Created',
    width: 180,
    renderCell: (data) => {
      return new Date(data.value).toLocaleString();
    },
  },
];

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
          <Typography sx={{ maxWidth: 'md' }}>
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

      <Dialog open={isVisible} onClose={() => setIsVisible(false)}>
        <DialogTitle>Create a New Meal Plan</DialogTitle>
        <DialogContent>
          <CreateMealPlanForm
            onSuccess={() => {
              refreshSSP();
              setIsVisible(false);
            }}
          />
        </DialogContent>
      </Dialog>

      <DataGrid
        pageSize={100}
        columns={columns}
        loading={isLoading}
        rows={props.mealplans}
        sx={{ height: '65vh' }}
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
