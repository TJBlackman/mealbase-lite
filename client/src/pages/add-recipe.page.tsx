import React from 'react';
import Layout from '../layouts/app-layout';
import { Typography, Grid } from '@material-ui/core';
import { AddRecipeForm } from '../forms/add-recipe.form';

export const AddRecipePage = () => {
  return (
    <Layout>
      <Grid container justify="center" style={{ marginTop: '20px' }}>
        <Grid item sm={8} md={6}>
          <Typography variant="h4">Add New Recipe</Typography>
          <Typography variant="body1">
            Complete the form below to add a new recipe!
          </Typography>
          <AddRecipeForm onSuccess={() => alert(3)} />
        </Grid>
      </Grid>
    </Layout>
  );
};
