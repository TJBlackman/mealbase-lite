import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Layout from '../layouts/app-layout';
import { Typography, Grid } from '@material-ui/core';

export const EditRecipePage = () => {
  const history = useHistory();
  const { recipeId } = useParams<{ recipeId: string }>();
  console.log(recipeId);
  return (
    <Layout>
      <Grid container justify='center' style={{ marginTop: '20px' }}>
        <Grid item sm={8} md={6}>
          <Typography variant='h4'>Edit Recipe</Typography>
          <Typography variant='body2'>Use the form below to edit the recipe. id: {recipeId}</Typography>
        </Grid>
      </Grid>
    </Layout>
  );
};
