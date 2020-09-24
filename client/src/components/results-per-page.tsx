import React, { ChangeEvent } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { useRecipeContext } from '../context/recipes';
import { networkRequest } from '../utils/network-request';
import { makeParamsFromState } from '../utils/recipe-query-params';
import { makeStyles } from '@material-ui/styles';

interface IProps {
  fullWidth?: boolean;
}

export const ResultsPerPage = ({ fullWidth = false }: IProps) => {
  const { updateRecipeContext, recipes, loading, filters } = useRecipeContext();
  const { root } = useStyles();

  const setResultsPerPage = (e: ChangeEvent<{ value: number }>) => {
    updateRecipeContext({ loading: true, filters: { limit: e.target.value } });
    const params = makeParamsFromState({
      ...filters,
      limit: e.target.value,
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
    <FormControl variant='outlined' size='small' disabled={loading} fullWidth={fullWidth}>
      <InputLabel id='filter-label'>Results</InputLabel>
      <Select fullWidth labelId='filter-label' value={filters.limit} onChange={setResultsPerPage} label='Results'>
        <MenuItem value='10'>10</MenuItem>
        <MenuItem value='20'>20</MenuItem>
        <MenuItem value='50'>50</MenuItem>
        <MenuItem value='100'>100</MenuItem>
      </Select>
    </FormControl>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: '80px',
  },
}));
