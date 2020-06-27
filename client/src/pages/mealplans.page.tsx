import React from 'react';
import Layout from '../layouts/app-layout';
import { Typography } from '@material-ui/core';

export const MealPlansPage = () => {
  return (
    <Layout>
      <Typography variant='h2'>MealPlans Page</Typography>
      <Typography variant='body1'>View or create a mealplan!</Typography>
    </Layout>
  );
};
