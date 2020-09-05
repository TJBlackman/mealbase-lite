import React, { useReducer, useEffect } from 'react';
import { Grid, TextField, Select, FormControl, InputLabel, MenuItem, Button, LinearProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useRecipeContext } from '../context/recipes';
import { useCookbookContext } from '../context/cookbooks';
import { useUserContext } from '../context/user';
import { IRecipeFilters, IGenericAction, RecipeSortOptions, RecipeFilterOptions } from '../types';
import { networkRequest } from '../utils/network-request';
import { makeParamsFromState } from '../utils/recipe-query-params';
import { RecipePagination } from '../components/recipe-pagination';
import { MobileOnlyDropdown } from '../components/mobile-only-dropdown';
import { RecipeListTypeSelect } from '../components/recipe-list-type-select';
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
    const global = JSON.stringify(filters);
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
              <FormControl variant='outlined' fullWidth size='small' disabled={loading}>
                <InputLabel id='filter-label'>My Cookbooks</InputLabel>
                <Select
                  fullWidth
                  labelId='filter-label'
                  value={localState.cookbook}
                  onChange={(e: React.ChangeEvent<{ value: string }>) =>
                    dispatch({ type: 'SET COOKBOOK', payload: e.target.value })
                  }
                  label='Filter Recipes'
                >
                  <MenuItem value=''>&nbsp;</MenuItem>
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
            <FormControl variant='outlined' fullWidth size='small' disabled={loading}>
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
                <MenuItem value=''>&nbsp;</MenuItem>
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
                onChange={(e: React.ChangeEvent<{ value: RecipeSortOptions }>) =>
                  dispatch({ type: 'SET SORT', payload: e.target.value })
                }
                label='Sort Recipes'
              >
                <MenuItem value=''>&nbsp;</MenuItem>
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
                onChange={(e: React.ChangeEvent<{ value: string }>) =>
                  dispatch({ type: 'SET LIMIT', payload: e.target.value })
                }
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
      </MobileOnlyDropdown>
      <Grid container spacing={3} alignItems='center' justify='space-between'>
        <Grid item xs={12} sm={6}>
          <RecipeListTypeSelect />
        </Grid>
        <Grid item xs={12} sm={6}>
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
