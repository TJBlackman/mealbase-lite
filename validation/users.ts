import Joi from 'joi';

// validate email
export const EmailSchema = Joi.string().email({ tlds: { allow: false } });

// validate password
export const PasswordSchema = Joi.string().min(6).max(128);

// req.body for POST /api/users
export const registerUserSchema = Joi.object({
  email: EmailSchema.required(),
  password: PasswordSchema.required(),
});

// req.body for POST /api/auth/local-login
export const localLoginSchema = registerUserSchema;

// req.body for POST /api/reset-password/confirm
export const resetPasswordConfirmSchema = Joi.object({
  password: PasswordSchema.required(),
  jwt: Joi.string().required(),
});
