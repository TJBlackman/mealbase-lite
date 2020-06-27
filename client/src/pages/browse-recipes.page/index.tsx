import React, { useEffect, useReducer } from 'react';
import { Typography } from '@material-ui/core';
import Layout from '../../layouts/app-layout';
import { networkRequest } from '../../utils/network-request';
import { IBrowseRecipeState } from './types';
import { BrowseRecipesReducer } from './reducer';

const defaultState: IBrowseRecipeState = {
  loading: false,
  recipes: [],
};

export const BrowsePage = () => {
  const [state, dispatch] = useReducer(BrowseRecipesReducer, defaultState);

  useEffect(() => {
    networkRequest({
      url: '/api/v1/recipes',
      success: (json) => {
        console.log(json);
      },
    });
  }, []);
  return (
    <Layout>
      <Typography variant='h4'>Browse Recipes Here</Typography>
      <Typography variant='body1'>Edit your user settings here.</Typography>
      <Typography variant='body1'>Search, filter, page, limit, sort</Typography>
      <Typography variant='body1'>Filter: All, Liked, </Typography>
    </Layout>
  );
};
