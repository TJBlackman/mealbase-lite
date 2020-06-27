import React, { useReducer } from 'react';
import {
  Grid,
  TextField,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from '@material-ui/core';

interface IAction {
  type: string;
  payload: any;
}

interface IFilterRecipesState {
  search: string;
  filter: '' | 'liked' | 'not liked';
  sort: 'newest' | 'oldest' | 'most likes' | 'fewest likes';
  page: number;
  loading: boolean;
}

enum ActionTypes {
  UPDATE_SEARCH,
  UPDATE_FILTER,
  UPDATE_SORT,
  UPDATE_PAGE,
  UPDATE_LOADING,
}

// default state
const defaultFilterRecipeState: IFilterRecipesState = {
  search: '',
  filter: '',
  sort: 'most likes',
  page: 1,
  loading: false,
};

// reducer
const FilterRecipesReducer = (state: IFilterRecipesState, action) => {
  const newState: IFilterRecipesState = { ...state };
  switch (action.type) {
    case ActionTypes.UPDATE_SEARCH: {
      newState.search = action.payload;
      break;
    }
    case ActionTypes.UPDATE_FILTER: {
      newState.filter = action.payload;
      break;
    }
    case ActionTypes.UPDATE_SORT: {
      newState.sort = action.payload;
      break;
    }
    case ActionTypes.UPDATE_PAGE: {
      newState.page = action.payload;
      break;
    }
    case ActionTypes.UPDATE_LOADING: {
      newState.loading = action.payload;
      break;
    }
    default: {
      console.error('Error! Unknown ActionType: ' + action.type);
    }
  }
  return newState;
};

// search field
// filter; all, liked, not-liked,
// sort; newest, oldest, Most liked, fewest liked,
// page; 1 - 92929292
export const FilterRecipeForm = () => {
  const [state, dispatch] = useReducer(
    FilterRecipesReducer,
    defaultFilterRecipeState
  );

  return (
    <div>
      <Grid container>
        <Grid item sm={12}>
          <TextField
            label="Search Recipes"
            value={state.search}
            fullWidth
            variant="outlined"
            onChange={(e) =>
              dispatch({
                type: ActionTypes.UPDATE_SEARCH,
                payload: e.target.value,
              })
            }
          />
        </Grid>
        <Grid item md={4}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel id="filter-label">Filter</InputLabel>
            <Select
              fullWidth
              labelId="filter-label"
              value={state.filter}
              onChange={(e) =>
                dispatch({
                  type: ActionTypes.UPDATE_FILTER,
                  payload: e.target.value,
                })
              }
              label="Filter"
            >
              <MenuItem value="">All Recipes</MenuItem>
              <MenuItem value="liked">Liked</MenuItem>
              <MenuItem value="not liked">Not Liked</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item md={4}>
          two
        </Grid>
        <Grid item md={4}>
          three
        </Grid>
      </Grid>
    </div>
  );
};
