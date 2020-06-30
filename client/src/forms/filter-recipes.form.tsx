import React, { useContext, useReducer } from 'react';
import { Grid, TextField, Select, FormControl, InputLabel, MenuItem, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AppContext } from '../context';
import { IFilterRecipesState } from '../types';

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
  const { globalState, updateBrowseFilter } = useContext(AppContext);
  const [localState, dispatch] = useReducer(reducer, globalState.browse.filters);
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateBrowseFilter(localState);
    // make api call
  };
  const updateForm = (payload: Partial<IFilterRecipesState>) => {
    dispatch({
      type: SET_FORM,
      payload,
    });
  };
  const styles = useStyles();
  return (
    <form onSubmit={onSubmit}>
      <Grid container className={styles.searchRow}>
        <TextField
          label='Search Recipes'
          value={localState.search}
          fullWidth
          variant='outlined'
          className={styles.searchInput}
          onChange={(e) => updateForm({ search: e.target.value })}
        />
        <Button type='submit' variant='contained' size='large' className={styles.btn}>
          Search
        </Button>
      </Grid>
      <Grid container spacing={3}>
        <Grid item sm={4}>
          <FormControl variant='outlined' fullWidth size='small'>
            <InputLabel id='filter-label'>Filter Recipes</InputLabel>
            <Select
              fullWidth
              labelId='filter-label'
              value={localState.filter}
              // @ts-ignore
              onChange={(e) => updateForm({ filter: e.target.value })}
              label='Filter Recipes'
            >
              <MenuItem value='all'>All Recipes</MenuItem>
              <MenuItem value='liked'>Liked</MenuItem>
              <MenuItem value='not liked'>Not Liked</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item sm={4}>
          <FormControl variant='outlined' fullWidth size='small'>
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
        <Grid item sm={4}>
          <FormControl variant='outlined' fullWidth size='small'>
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
    </form>
  );
};

const useStyles = makeStyles({
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
});
