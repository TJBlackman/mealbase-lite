import React, { useContext, useEffect } from 'react';
import { Typography, Divider } from '@material-ui/core';
import Layout from '../../layouts/app-layout';
import { FilterRecipeForm } from '../../forms/filter-recipes.form';

export const BrowsePage = () => {
  return (
    <Layout>
      <Typography variant='h4'>Browse Recipes Here</Typography>
      <Typography variant='body1'>Edit your user settings here.</Typography>
      <Typography variant='body1'>Search, filter, page, limit, sort</Typography>
      <Typography variant='body1'>Filter: All, Liked, </Typography>
      <Divider style={{ margin: '10px' }} />
      <FilterRecipeForm />
    </Layout>
  );
};
