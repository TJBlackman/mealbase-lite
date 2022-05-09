import Joi from "joi";

// validate email
export const EmailSchema = Joi.string().email({ tlds: { allow: false } });

// validate family
export const PasswordSchema = Joi.string().min(6).max(128);

// req.body for POST /api/users
export const registerUserSchema = Joi.object({
  email: EmailSchema.required(),
  password: PasswordSchema.required(),
});

// req.body for POST /api/auth/local-login
export const localLoginSchema = registerUserSchema;
