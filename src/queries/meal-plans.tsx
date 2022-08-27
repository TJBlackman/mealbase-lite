import { MealPlan } from '@src/db/meal-plans';
import { networkRequest } from '@src/utils/network-request';
import { useQuery } from 'react-query';

/** A query that return the number of meal plans the currently logged in user has. */
export function useMealPlansQuery() {
  return useQuery(['mealplans'], () =>
    networkRequest<(MealPlan & { _id: string })[]>({
      url: '/api/meal-plans',
    })
  );
}
