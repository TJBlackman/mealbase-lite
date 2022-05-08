import Joi from 'joi';

// req.body for POST /api/recipes/add-recipe
export const addRecipeSchema = Joi.object({
  url: Joi.string().uri().required(),
});

// req.body for /api/recipe/toggle-recipe-like
export const toggleRecipeLikeSchema = Joi.object({
  recipeId: Joi.string().required(),
});
