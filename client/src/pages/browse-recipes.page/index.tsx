import React, { useContext } from 'react';
import { Typography, Grid } from '@material-ui/core';
import Layout from '../../layouts/app-layout';
import { FilterRecipeForm } from '../../forms/filter-recipes.form';
import { RecipeCard } from '../../components/recipe-card';
import { AppContext } from '../../context';

export const BrowsePage = () => {
  const { globalState } = useContext(AppContext);
  return (
    <Layout>
      <Typography variant='h4'>Browse Recipes</Typography>
      <Typography variant='subtitle1'>
        Use this page to search for new recipes. Users may like a recipe, add it to a cookbook or mealplan, or simply
        click on the recipe title to be taken to that recipe's original website.
      </Typography>
      <FilterRecipeForm />
      <Grid container justify='space-around'>
        {globalState.browse.recipes.map((item) => (
          <RecipeCard recipe={item} />
        ))}
      </Grid>
    </Layout>
  );
};
