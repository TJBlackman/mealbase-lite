import Joi from "joi";

// req.body for POST /api/recipes/add-recipe
export const addRecipeSchema = Joi.object({
  url: Joi.string().uri().required(),
});
