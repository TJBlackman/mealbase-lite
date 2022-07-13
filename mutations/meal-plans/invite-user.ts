import { MealPlanPermissions } from '@src/types';
import { networkRequest } from '@src/utils/network-request';
import { useMutation } from 'react-query';

/**
 * A user can invite another user to this mealplan.
 */

type Payload = {
  mealplanId: string;
  email: string;
  permission: MealPlanPermissions;
};

type Response = {
  success: boolean;
  message: string;
};

export function useInviteUserToMealplanMutation() {
  return useMutation((payload: Payload) =>
    networkRequest<Response>({
      method: 'POST',
      url: '/api/meal-plans/invite-user',
      body: payload,
    })
  );
}
