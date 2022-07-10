import Joi from 'joi';

export const addRecipeToMealplanSchema = Joi.object({
  recipeId: Joi.string().required(),
  mealplanId: Joi.string(),
  mealplanTitle: Joi.string(),
}).xor('mealplanId', 'mealplanTitle');

// .xor() defines that one or the other must be present, but not both.
// https://joi.dev/api/?v=15.1.1#objectxorpeers
