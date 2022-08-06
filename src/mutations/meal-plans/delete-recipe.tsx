import { networkRequest } from '@src/utils/network-request';
import { useMutation } from 'react-query';

/**
 * A user can delete a recipe from a mealplan.
 */

type Payload = {
  mealplanId: string;
  recipeId: string;
};

type Response = {
  success: boolean;
  message: string;
};

export function useDeleteRecipeFromMealpanMutation() {
  return useMutation((payload: Payload) =>
    networkRequest<Response>({
      method: 'DELETE',
      url: '/api/meal-plans/delete-recipe',
      body: payload,
    })
  );
}
