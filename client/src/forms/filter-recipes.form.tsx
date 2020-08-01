import React, { useContext, useReducer, useEffect } from 'react';
import { Grid, TextField, Select, FormControl, InputLabel, MenuItem, Button, LinearProgress } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import { makeStyles } from '@material-ui/core/styles';
import { AppContext } from '../context';
import { IFilterRecipesState } from '../types';
import { networkRequest } from '../utils/network-request';
import { makeParamsFromState } from '../utils/recipe-query-params';
import { RecipePagination } from '../components/recipe-pagination';

// reducer
const SET_FORM = 'SET FORM';
const reducer = (state: IFilterRecipesState, action: { type: string; payload: Partial<IFilterRecipesState> }) => {
  switch (action.type) {
    case SET_FORM: {
      return {
        ...state,
        ...action.payload,
      };
    }
    default: {
      return state;
    }
  }
};

export const FilterRecipeForm = () => {
  const { globalState, updateRecipesState } = useContext(AppContext);
  const [localState, dispatch] = useReducer(reducer, globalState.recipes.filters);
  const { loading } = globalState.recipes;
  // recipe api call
  const getRecipes = () => {
    const queryParams = makeParamsFromState(localState);
    updateRecipesState({
      filters: { ...localState },
      loading: true,
    });
    networkRequest({
      url: '/api/v1/recipes' + queryParams,
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
  // submit form
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    getRecipes();
  };
  // easy reducer handler
  const updateForm = (payload: Partial<IFilterRecipesState>) => {
    dispatch({
      type: SET_FORM,
      payload,
    });
  };
  // get recipes on mount
  useEffect(() => {
    if (globalState.recipes.browse.length === 0) {
      getRecipes();
    }
  }, []);
  // styles
  const styles = useStyles();
  // localState has been updated, does not match globalState
  const noUpdatedFilters = (() => {
    const global = JSON.stringify(globalState.recipes.filters);
    const local = JSON.stringify(localState);
    return local === global;
  })();

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <Grid container className={styles.searchRow}>
        <TextField
          label='Search Recipes'
          value={localState.search}
          fullWidth
          variant='outlined'
          className={styles.searchInput}
          onChange={(e) => updateForm({ search: e.target.value })}
          disabled={loading}
        />
        <Button
          type='submit'
          variant='contained'
          size='large'
          className={styles.btn}
          disabled={loading || noUpdatedFilters}
          color='primary'
        >
          {loading ? 'Loading...' : 'Search'}
        </Button>
      </Grid>
      <Grid container spacing={3}>
        <Grid item sm={4} xs={12}>
          <FormControl variant='outlined' fullWidth size='small' disabled={loading}>
            <InputLabel id='filter-label'>Filter Recipes</InputLabel>
            <Select
              fullWidth
              labelId='filter-label'
              value={localState.filter}
              // @ts-ignore
              onChange={(e: React.ChangeEvent<InputEvent>) => updateForm({ filter: e.target.value })}
              label='Filter Recipes'
            >
              <MenuItem value='x'>All Recipes</MenuItem>
              <MenuItem value='liked'>Liked Recipes</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item sm={4} xs={12}>
          <FormControl variant='outlined' fullWidth size='small' disabled={loading}>
            <InputLabel id='filter-label'>Sort Recipes</InputLabel>
            <Select
              fullWidth
              labelId='filter-label'
              value={localState.sort}
              // @ts-ignore
              onChange={(e) => updateForm({ sort: e.target.value })}
              label='Sort Recipes'
            >
              <MenuItem value='newest'>Newest</MenuItem>
              <MenuItem value='oldest'>Oldest</MenuItem>
              <MenuItem value='most liked'>Most Popular</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item sm={4} xs={12}>
          <FormControl variant='outlined' fullWidth size='small' disabled={loading}>
            <InputLabel id='filter-label'>Results Per Page</InputLabel>
            <Select
              fullWidth
              labelId='filter-label'
              value={localState.limit}
              // @ts-ignore
              onChange={(e) => updateForm({ limit: e.target.value })}
              label='Results Per Page'
            >
              <MenuItem value='2'>2</MenuItem>
              <MenuItem value='3'>3</MenuItem>
              <MenuItem value='5'>5</MenuItem>
              <MenuItem value='10'>10</MenuItem>
              <MenuItem value='20'>20</MenuItem>
              <MenuItem value='50'>50</MenuItem>
              <MenuItem value='100'>100</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <RecipePagination />
        </Grid>
      </Grid>
      <div className={styles.loading}>{loading && <LinearProgress />}</div>
    </form>
  );
};

const useStyles = makeStyles({
  form: {
    marginTop: '20px',
  },
  searchRow: {
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: '0 0 20px 0',
  },
  searchInput: {
    flex: '1 1 auto',
  },
  btn: {
    marginLeft: '20px',
    height: '56px',
  },
  loading: {
    padding: '20px 0',
  },
});
