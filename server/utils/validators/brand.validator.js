import Joi from "joi";

export const createBrandSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .trim()
    .required()
});


export const updateBrandSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .trim()
}).min(1);
