import React, { useContext, ChangeEvent } from 'react';
import { Pagination } from '@material-ui/lab';
import { Grid } from '@material-ui/core';
import { AppContext } from '../context';
import { networkRequest } from '../utils/network-request';
import { makeParamsFromState } from '../utils/recipe-query-params';

export const RecipePagination = () => {
  const { globalState, updateRecipesState } = useContext(AppContext);
  const {
    totalCount,
    filters: { limit, page },
  } = globalState.recipes;
  const pageCount = Math.ceil(totalCount / limit);

  const setPage = (e: ChangeEvent<unknown>, num: number) => {
    updateRecipesState({ loading: true, filters: { page: num } });
    const params = makeParamsFromState({
      ...globalState.recipes.filters,
      page: num,
    });
    networkRequest({
      url: '/api/v1/recipes' + params,
      success: (json) => {
        updateRecipesState({
          loading: false,
          totalCount: json.data.totalCount,
          browse: json.data.recipes,
        });
      },
      error: (err) => {
        updateRecipesState({ loading: false });
        alert(err.message);
      },
    });
  };

  return (
    <Grid container justify='flex-end'>
      <Pagination count={pageCount} page={page} onChange={setPage} disabled={globalState.recipes.loading} />
    </Grid>
  );
};
