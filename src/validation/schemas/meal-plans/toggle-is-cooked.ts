import Joi from 'joi';

export const toggleRecipeIsCooked = Joi.object({
  recipeId: Joi.string().required(),
  mealplanId: Joi.string().required(),
});
