import { networkRequest } from '@src/utils/network-request';
import { useQuery } from 'react-query';

/** A query that return the number of meal plans the currently logged in user has. */
export function useMealPlanCountQuery() {
  return useQuery(['mealplans', 'count'], () =>
    networkRequest<{ count: number }>({
      url: '/api/meal-plans/count',
    })
  );
}
