import React from 'react';
import Layout from '../layouts/app-layout';
import { Typography } from '@material-ui/core';

export const HomePage = () => {
  return (
    <Layout>
      <Typography variant='h2'>Mealbase Home Page</Typography>
      <Typography variant='body2'>Welcome to the MealBase Lite home page.</Typography>
    </Layout>
  );
};
