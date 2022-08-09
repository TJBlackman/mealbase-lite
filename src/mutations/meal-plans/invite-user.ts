import { MealPlanPermissions } from "@src/types";
import { networkRequest } from "@src/utils/network-request";
import { useMutation } from "react-query";

/**
 * A user can invite another user to this mealplan.
 */

type Payload = {
  mealplanId: string;
  email: string;
  permissions: MealPlanPermissions[];
};

type Response = {
  success: boolean;
  message: string;
};

export function useInviteUserToMealplanMutation() {
  return useMutation((payload: Payload) => {
    console.log(payload);
    const { mealplanId, ...body } = payload;
    return networkRequest<Response>({
      method: "POST",
      url: `/api/meal-plans/${mealplanId}/add-member`,
      body,
    });
  });
}
