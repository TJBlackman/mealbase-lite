import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../layouts/app-layout';
import { Typography, Grid } from '@material-ui/core';
import { RecipeEditForm } from '../forms/recipe-edit.form';

export const EditRecipePage = () => {
  const { recipeId } = useParams<{ recipeId: string }>();
  return (
    <Layout>
      <Grid container justify='center' style={{ marginTop: '20px' }}>
        <Grid item sm={8} md={6}>
          <Typography variant='h4'>Edit Recipe</Typography>
          <Typography variant='body2'>Use the form below to edit the recipe.</Typography>
          <br />
          <RecipeEditForm recipeId={recipeId} />
        </Grid>
      </Grid>
    </Layout>
  );
};
