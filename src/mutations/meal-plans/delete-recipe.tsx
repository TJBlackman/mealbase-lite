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
  return useMutation(({ mealplanId, recipeId }: Payload) =>
    networkRequest<Response>({
      method: 'DELETE',
      url: `/api/meal-plans/${mealplanId}/remove-recipe/${recipeId}`,
    })
  );
}
