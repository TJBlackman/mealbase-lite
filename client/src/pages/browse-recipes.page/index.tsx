import React, { useContext } from 'react';
import { Typography, Grid } from '@material-ui/core';
import Layout from '../../layouts/app-layout';
import { FilterRecipeForm } from '../../forms/filter-recipes.form';
import { RecipeCard } from '../../components/recipe-card';
import { AppContext } from '../../context';

export const BrowsePage = () => {
  const { globalState } = useContext(AppContext);
  const showNoResults = globalState.browse.loading === false && globalState.browse.recipes.length === 0;
  return (
    <Layout>
      <Typography variant='h3' component='h1'>
        Browse Recipes
      </Typography>
      <Typography variant='subtitle1'>
        Search for new or old recipes. You may filter recpes, sort them into particular order, and limit the number of
        results you see per page.
      </Typography>
      <FilterRecipeForm />
      <Grid container justify='space-around'>
        {globalState.browse.recipes.map((item) => (
          <RecipeCard recipe={item} key={item._id} />
        ))}
        {showNoResults && (
          <Typography variant='body1' style={{ textAlign: 'center' }}>
            No Results
          </Typography>
        )}
      </Grid>
    </Layout>
  );
};
