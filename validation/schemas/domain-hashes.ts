import Joi from 'joi';

export const editDomainHashSchema = Joi.object({
  domain: Joi.string().required(),
  selector: Joi.string().required(),
});
