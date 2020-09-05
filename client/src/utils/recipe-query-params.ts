// take in global recipe filter state
// return back a query parameter string

import { IRecipeFilters } from "../types";

export const makeParamsFromState = (state: IRecipeFilters) => {
  let params = '?';
  if (state.filter) {
    params = params + `filter=${state.filter}&`;
  }
  if (state.limit) {
    params = params + `limit=${state.limit}&`;
  }
  if (state.page) {
    params = params + `skip=${(state.page - 1) * state.limit}&`;
  }
  if (state.search) {
    params = params + `search=${state.search}&`;
  }
  if (state.cookbook) {
    params = params + `cookbook=${state.cookbook}&`;
  }
  if (state.sort) {
    switch (state.sort) {
      case 'newest': {
        params = params + `sortBy=createdAt&sortOrder=-1&`;
        break;
      }
      case 'oldest': {
        params = params + `sortBy=createdAt&sortOrder=1&`;
        break;
      }
      case 'most liked': {
        params = params + `sortBy=likes&sortOrder=-1&`;
      }
    }
  }
  return params;
};