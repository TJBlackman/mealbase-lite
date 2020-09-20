import React, { useState } from 'react';
import { Typography, Grid, Button } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { IRecipe } from '../types';
import Layout from '../layouts/app-layout';
import { AddRecipeForm } from '../forms/recipe-new.form';
import { RecipeCard } from '../components/recipe-card';

export const AddRecipePage = () => {
  const [recipe, setRecipe] = useState<IRecipe | null>(null);
  return (
    <Layout>
      {!!recipe ? (
        <>
          <Button onClick={() => setRecipe(null)}>
            <ChevronLeftIcon /> Add Another Recipe
          </Button>
          <Grid container justify='center'>
            <RecipeCard recipe={recipe} />
          </Grid>
        </>
      ) : (
        <Grid container justify='center' style={{ marginTop: '20px' }}>
          <Grid item sm={8} md={6}>
            <Typography variant='h4'>Add New Recipe</Typography>
            <Typography variant='body1'>Complete the form below to add a new recipe!</Typography>
            <AddRecipeForm onSuccess={(data) => setRecipe(data)} />
          </Grid>
        </Grid>
      )}
    </Layout>
  );
};
