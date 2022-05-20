import Joi from "joi";

// req.body for POST /api/recipes/add-recipe
export const addRecipeSchema = Joi.object({
  url: Joi.string().uri().required(),
});

// req.body for /api/recipes/toggle-recipe-like
export const toggleRecipeLikeSchema = Joi.object({
  recipeId: Joi.string().required(),
});

// req.body for /api/recipes/edit
export const editRecipeSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string().uri().required(),
  url: Joi.string().uri().required(),
  siteName: Joi.string().required(),
  deleted: Joi.boolean().required(),
  _id: Joi.string().required(),
});
