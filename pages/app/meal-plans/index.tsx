import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import { MealPlan } from '@src/types/index.d';
import { MealPlansModel } from '@src/db/meal-plans';
import { useState } from 'react';
import { CreateMealPlanForm } from '@src/forms/meal-plan-create';
import { mongoDbConnection } from '@src/db/connection';
import { getUserJWT } from '@src/validation/server-requests';
import { GetServerSideProps } from 'next';
import error from 'next/error';
import { NextResponse } from 'next/server';

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

    const mealplans = await MealPlansModel.find({ owner: user._id });
    const count = await MealPlansModel.count({ ownder: user._id });

    return { props: { mealplans, count } };
  } catch (err) {
    console.log(error);
    let msg = 'An unknown error occurred.';
    if (error instanceof Error) {
      msg = error.message;
    }
    return { props: { mealplans: [], count: 0, error: msg } };
  }
};

type Props = {
  mealplans: MealPlan[]; 
  count: number; 
  error?: string;
}

export default function MealPlansPage() {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <>
      <Typography variant="h5" component="h1">
        Meal Plans
      </Typography>
      <Typography sx={{ maxWidth: 'md' }}>
        A meal plan is a small collection of the recipes to help you plan what
        meals you want to cook in the near future. Use this page to create and
        manage all your Meal plans!
      </Typography>
      <Button onClick={() => setIsVisible(true)}>Create New Meal Plan</Button>
      {props.error && (<Typography>An error occurred: {props.error}</Typography>)}
      <Dialog open={isVisible} onClose={() => setIsVisible(false)}>
        <DialogTitle>Create a New Meal Plan</DialogTitle>
        <DialogContent>
          <CreateMealPlanForm />
        </DialogContent>
      </Dialog>
    </>
  );
}
