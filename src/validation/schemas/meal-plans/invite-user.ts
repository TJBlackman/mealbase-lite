import Joi from "joi";

export const inviteUserToMealPlan = Joi.object({
  email: Joi.string().email().required(),
  permissions: Joi.array().items(Joi.string()).required(),
});
