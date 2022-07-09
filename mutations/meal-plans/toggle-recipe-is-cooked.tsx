import { MealPlanDocument } from "@src/types";
import { networkRequest } from "@src/utils/network-request";
import { useMutation } from "react-query";

/**
 * A user can toggle a meal plan recipe between isCooked:true|false.
 */

type Payload = {
  mealplanId: string;
  recipeId: string;
};

type Response = {
  mealplan: MealPlanDocument;
  isCooked: boolean;
};

export function useToggleRecipeIsCookedMutation() {
  return useMutation((payload: Payload) =>
    networkRequest<Response>({
      method: "POST",
      url: "/api/meal-plans/toggle-recipe-is-cooked",
      body: payload,
    })
  );
}
