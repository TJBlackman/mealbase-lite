import Joi from "joi";

// req.body for POST /api/users
export const registerUserSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().min(6).max(128).required(),
});

// req.body for POST /api/auth/local-login
export const localLoginSchema = registerUserSchema;
