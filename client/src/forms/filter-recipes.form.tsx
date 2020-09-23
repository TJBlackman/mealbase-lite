import React, { useReducer, useEffect } from 'react';
import { Grid, TextField, Select, FormControl, InputLabel, MenuItem, Button, LinearProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useRecipeContext } from '../context/recipes';
import { useCookbookContext } from '../context/cookbooks';
import { useUserContext } from '../context/user';
import { IRecipeFilters, IGenericAction, RecipeSortOptions, RecipeFilterOptions } from '../types';
import { networkRequest } from '../utils/network-request';
import { makeParamsFromState } from '../utils/recipe-query-params';
import { MobileOnlyDropdown } from '../components/mobile-only-dropdown';
import { getNewState } from '../utils/copy-state';

// reducer
type Action =
  | IGenericAction<'UPDATE SEARCH', string>
  | IGenericAction<'SUBMIT FORM'>
  | IGenericAction<'SET COOKBOOK', string>
  | IGenericAction<'SET SORT', RecipeSortOptions>
  | IGenericAction<'SET LIMIT', string>
  | IGenericAction<'SET FILTER', RecipeFilterOptions>;

const reducer = (state: IRecipeFilters, action: Action) => {
  const newState = getNewState<IRecipeFilters>(state);
  switch (action.type) {
    case 'UPDATE SEARCH': {
      newState.search = action.payload;
      return newState;
    }
    case 'SET COOKBOOK': {
      newState.cookbook = action.payload;
      return newState;
    }
    case 'SET SORT': {
      newState.sort = action.payload;
      return newState;
    }
    case 'SET FILTER': {
      newState.filter = action.payload;
      return newState;
    }
    case 'SET LIMIT': {
      newState.limit = parseInt(action.payload);
      return newState;
    }
    default: {
      console.error(`Unknown action type:\n${JSON.stringify(action, null, 2)}`);
      return state;
    }
  }
};

export const FilterRecipeForm = () => {
  const { updateRecipeContext, recipes, loading, filters } = useRecipeContext();
  const { cookbooks } = useCookbookContext();
  const { user } = useUserContext();
  const [localState, dispatch] = useReducer(reducer, filters);

  // recipe api call
  const getRecipes = () => {
    const queryParams = makeParamsFromState(localState);
    updateRecipeContext({
      filters: { ...localState },
      loading: true,
    });
    networkRequest({
      url: '/api/v1/recipes' + queryParams,
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

  // submit form
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    getRecipes();
  };

  // get recipes on mount
  useEffect(() => {
    if (recipes.length === 0) {
      getRecipes();
    }
  }, []);

  // styles
  const styles = useStyles();

  // localState has been updated, does not match globalState
  const noUpdatedFilters = (() => {
    if (filters.search !== localState.search) {
      return false;
    }
    if (filters.filter !== localState.filter) {
      return false;
    }
    if (filters.cookbook !== localState.cookbook) {
      return false;
    }
    if (filters.sort !== localState.sort) {
      return false;
    }
    return true;
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
          onChange={(e) => dispatch({ type: 'UPDATE SEARCH', payload: e.target.value })}
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
      <MobileOnlyDropdown>
        <Grid container spacing={3}>
          {user.email && (
            <Grid item sm={4} xs={12}>
              <FormControl
                variant='outlined'
                fullWidth
                size='small'
                disabled={loading}
                focused={!loading && Boolean(localState.cookbook)}
              >
                <InputLabel id='filter-label'>My Cookbooks</InputLabel>
                <Select
                  fullWidth
                  labelId='filter-label'
                  value={localState.cookbook}
                  onChange={(e: React.ChangeEvent<{ value: string }>) =>
                    dispatch({ type: 'SET COOKBOOK', payload: e.target.value })
                  }
                  label='My Cookbooks'
                >
                  <MenuItem value=''>
                    <i>Unselect Cookbook</i>
                  </MenuItem>
                  {cookbooks.map((cb) => (
                    <MenuItem value={cb._id} key={cb._id}>
                      {cb.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
          <Grid item sm={4} xs={12}>
            <FormControl
              variant='outlined'
              fullWidth
              size='small'
              disabled={loading}
              focused={!loading && Boolean(localState.filter)}
            >
              <InputLabel id='filter-label'>Filter Recipes</InputLabel>
              <Select
                fullWidth
                labelId='filter-label'
                value={localState.filter}
                onChange={(e: React.ChangeEvent<{ value: RecipeFilterOptions }>) =>
                  dispatch({ type: 'SET FILTER', payload: e.target.value })
                }
                label='Filter Recipes'
                color='primary'
              >
                <MenuItem value=''>
                  <i>No Filters</i>
                </MenuItem>
                <MenuItem value='liked recipes'>Liked Recipes</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item sm={4} xs={12}>
            <FormControl
              variant='outlined'
              fullWidth
              size='small'
              disabled={loading}
              focused={!loading && Boolean(localState.sort)}
            >
              <InputLabel id='sort-label'>Sort Recipes</InputLabel>
              <Select
                fullWidth
                labelId='sort-label'
                value={localState.sort}
                onChange={(e: React.ChangeEvent<{ value: RecipeSortOptions }>) =>
                  dispatch({ type: 'SET SORT', payload: e.target.value })
                }
                label='Sort Recipes'
              >
                <MenuItem value=''>
                  <i>Default Sort</i>
                </MenuItem>
                <MenuItem value='newest'>Newest</MenuItem>
                <MenuItem value='oldest'>Oldest</MenuItem>
                <MenuItem value='most liked'>Most Popular</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </MobileOnlyDropdown>
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
