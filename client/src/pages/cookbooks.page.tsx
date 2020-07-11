import React from 'react';
import Layout from '../layouts/app-layout';
import { Typography } from '@material-ui/core';

export const CookbooksPage = () => {
  return (
    <Layout>
      <Typography variant='h3' component='h1'>
        Cookbooks Page
      </Typography>
      <Typography variant='body1'>
        Cookbooks are a way to organize your recipes. You might create a cookbook full of breakfast or dinner recipes,
        and a separate cookbook for cocktail recipes, or cookbook for only deserts. Cookbooks help you arrange the
        recipes you like into groups that make sense to you!
      </Typography>
    </Layout>
  );
};
