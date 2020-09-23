import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import Layout from '../../layouts/app-layout';
import { FilterRecipeForm } from '../../forms/filter-recipes.form';
import { RecipeCard } from '../../components/recipe-card';
import { RecipeListItem } from '../../components/recipe-list-item';
import { RecipeListItemDense } from '../../components/recipe-list-item-dense';
import { useRecipeContext } from '../../context/recipes';
import { RecipePagination } from '../../components/recipe-pagination';
import { RecipeListTypeSelect } from '../../components/recipe-list-type-select';
import { ResultsPerPage } from '../../components/results-per-page';

export const BrowsePage = () => {
  const { recipes, displayType, loading } = useRecipeContext();
  const showNoResults = loading === false && recipes.length === 0;
  const CardItem = (() => {
    switch (displayType) {
      case 'cards':
        return RecipeCard;
      case 'list':
        return RecipeListItem;
      case 'dense':
        return RecipeListItemDense;
      default: {
        console.error('Unknown recipe display type: ', displayType);
        return RecipeListItem;
      }
    }
  })();
  return (
    <Layout>
      <Typography variant='h3' component='h1'>
        Browse Recipes
      </Typography>
      <Typography variant='subtitle1'>
        Search for new or old recipes. You may filter recipes, sort them into particular order, and limit the number of
        results you see per page.
      </Typography>
      <FilterRecipeForm />
      <Grid container spacing={3} alignItems='center' justify='flex-end'>
        <Grid item>
          <ResultsPerPage />
        </Grid>
        <Grid item>
          <RecipeListTypeSelect />
        </Grid>
        <Grid item>
          <RecipePagination />
        </Grid>
      </Grid>
      <Grid container justify='space-around'>
        {recipes.map((item) => (
          <CardItem key={item._id} recipe={item} />
        ))}
        {showNoResults && (
          <Typography variant='body1' style={{ textAlign: 'center' }}>
            No Results
          </Typography>
        )}
      </Grid>
      <Grid container spacing={3} alignItems='center' justify='flex-end'>
        <Grid item>
          <RecipePagination />
        </Grid>
      </Grid>
    </Layout>
  );
};
