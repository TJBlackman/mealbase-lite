import Joi from 'joi';

export const deleteRecipeFromMealPlanSchema = Joi.object({
  mealplanId: Joi.string().required(),
  recipeId: Joi.string().required(),
});
