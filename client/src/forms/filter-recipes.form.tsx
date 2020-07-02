import React, { useContext, useReducer, useEffect } from 'react';
import {
  Grid,
  TextField,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Button,
  CircularProgress,
  LinearProgress,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AppContext } from '../context';
import { IFilterRecipesState } from '../types';
import { networkRequest } from '../utils/network-request';

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

const makeParamsFromState = (state: IFilterRecipesState) => {
  return `?search=${state.search}&limit=${state.limit}`;
};

export const FilterRecipeForm = () => {
  const { globalState, updateBrowsePage } = useContext(AppContext);
  const [localState, dispatch] = useReducer(reducer, globalState.browse.filters);
  const { loading } = globalState.browse;
  // recipe api call
  const getRecipes = () => {
    const queryParams = makeParamsFromState(localState);
    networkRequest({
      url: '/api/v1/recipes' + queryParams,
      before: () => {
        updateBrowsePage({
          filters: { ...localState },
          loading: true,
        });
      },
      success: (json) => {
        updateBrowsePage({
          loading: false,
          recipes: json.data,
        });
      },
      error: (err) => {
        updateBrowsePage({ loading: false });
        alert(err.message);
      },
    });
  };
  // submit form
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    getRecipes();
  };
  // easy educer handler
  const updateForm = (payload: Partial<IFilterRecipesState>) => {
    dispatch({
      type: SET_FORM,
      payload,
    });
  };
  // get recipes on mount
  useEffect(() => {
    if (globalState.browse.recipes.length === 0) {
      getRecipes();
    }
  }, []);
  // styles
  const styles = useStyles();

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
        <Button type='submit' variant='contained' size='large' className={styles.btn} disabled={loading}>
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
              <MenuItem value='all'>All Recipes</MenuItem>
              <MenuItem value='liked'>Liked</MenuItem>
              <MenuItem value='not liked'>Not Liked</MenuItem>
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
              <MenuItem value='most likes'>Most Popular</MenuItem>
              <MenuItem value='fewest likes'>Least Popular</MenuItem>
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
              <MenuItem value='10'>10</MenuItem>
              <MenuItem value='20'>20</MenuItem>
              <MenuItem value='50'>50</MenuItem>
              <MenuItem value='100'>100</MenuItem>
            </Select>
          </FormControl>
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
