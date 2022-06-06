import Joi from "joi";

// req.body for POST /api/recipes/add-recipe
export const editFailedRecipesSchema = Joi.object<{ resolved: boolean }>({
  resolved: Joi.boolean().required(),
});
