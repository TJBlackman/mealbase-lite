import React, { useContext, ChangeEvent } from 'react';
import { Pagination } from '@material-ui/lab';
import { Grid } from '@material-ui/core';
import { networkRequest } from '../utils/network-request';
import { makeParamsFromState } from '../utils/recipe-query-params';
import { useRecipeContext } from '../context/recipes';

export const RecipePagination = () => {
  const { loading, filters, updateRecipeContext, totalCount } = useRecipeContext();
  const pageCount = Math.ceil(totalCount / filters.limit);

  const setPage = (e: ChangeEvent<unknown>, num: number) => {
    updateRecipeContext({ loading: true, filters: { page: num } });
    const params = makeParamsFromState({
      ...filters,
      page: num,
    });
    networkRequest({
      url: '/api/v1/recipes' + params,
      success: (json) => {
        updateRecipeContext({
          loading: false,
          totalCount: json.data.totalCount,
          recipes: json.data.recipes,
        });
      },
      error: (err) => {
        updateRecipeContext({ loading: false });
        alert(err.message);
      },
    });
  };

  return (
    <Grid container justify='flex-end'>
      <Pagination count={pageCount} page={filters.page} onChange={setPage} disabled={loading} />
    </Grid>
  );
};
