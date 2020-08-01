import React from 'react';
import Layout from '../layouts/app-layout';
import { Typography } from '@material-ui/core';

export const MealPlansPage = () => {
  return (
    <Layout>
      <Typography variant='h2'>MealPlans Page</Typography>
      <Typography variant='body1'>
        A mealplan is short collection of recipes, and can be used to create a shopping list and plan out recipes for
        the immediate future.
      </Typography>
    </Layout>
  );
};
