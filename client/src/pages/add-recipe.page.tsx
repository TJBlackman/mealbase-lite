import React from 'react';
import Layout from '../layouts/app-layout';
import { Typography } from '@material-ui/core';

export const AddRecipePage = () => {
  return (
    <Layout>
      <Typography variant='h4'>Add New Recipe</Typography>
      <Typography variant='body1'>Add a new recipe here.</Typography>
    </Layout>
  );
};
