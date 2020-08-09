import React from 'react';
import Layout from '../layouts/app-layout';
import { Typography } from '@material-ui/core';

export const CookbooksPage = () => {
  return (
    <Layout>
      <Typography variant='h3' component='h1'>
        Cookbooks
      </Typography>
      <Typography variant='h6'>
        Cookbooks allow users to easily organize recipes they like! You might create a cookbook full of breakfast or
        dinner recipes, a separate cookbook for cocktail recipes, or cookbook for only deserts. Cookbooks help users
        arrange the recipes they like into groups that make sense to them!
      </Typography>
    </Layout>
  );
};
