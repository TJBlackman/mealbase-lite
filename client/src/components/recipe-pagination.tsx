import React, { useContext, ChangeEvent } from 'react';
import { Pagination } from '@material-ui/lab';
import { Grid } from '@material-ui/core';
import { networkRequest } from '../utils/network-request';
import { makeParamsFromState } from '../utils/recipe-query-params';
import { useRecipeContext } from '../context/recipes';

export const RecipePagination = () => {
  const { loadingNewRecipes, filters, setFilters, totalCount } = useRecipeContext();
  if (loadingNewRecipes) {
    return null;
  }

  const pageCount = Math.ceil(totalCount / filters.limit);

  const setPage = (_e: ChangeEvent<unknown>, page: number) => {
    setFilters({ page });
  };

  return (
    <Grid container justify='flex-end'>
      <Pagination count={pageCount} page={filters.page} onChange={setPage} disabled={loadingNewRecipes} />
    </Grid>
  );
};
