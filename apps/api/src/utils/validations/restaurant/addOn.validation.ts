import Joi from "joi";
import { NSRestaurant } from "../../../types";
import { commonValidation } from "../common.validation";

const createAddonSchema = {
  body: Joi.object<NSRestaurant.IAddon>().keys({
    description: Joi.string(),
    image: Joi.string().uri(),
    name: Joi.string().required(),
    price: Joi.number().required(),
  }),
};

const listAddonSchema = {
  query: Joi.object().keys({
    resultPerPage: Joi.number().integer().min(1).default(10).optional(),
    page: Joi.number().integer().min(1).default(1).optional(),
    q: Joi.string().optional(), // search query
  }),
};

const updateAddonSchema = {
  body: Joi.object<NSRestaurant.IAddon>()
    .keys({
      name: Joi.string(),
      description: Joi.string(),
      image: Joi.string().uri(),
      price: Joi.number(),
    })
    .min(1),
  params: Joi.object().keys({
    id: commonValidation.ObjectIdSchema.required(),
  }),
};

export const addOnValidation = {
  createAddonSchema,
  updateAddonSchema,
  listAddonSchema,
};
