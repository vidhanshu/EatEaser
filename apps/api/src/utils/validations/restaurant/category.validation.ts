import Joi from "joi";
import { NSRestaurant } from "../../../types";
import { commonValidation } from "../common.validation";

const createCategorySchema = {
  body: Joi.object<NSRestaurant.ICategory>().keys({
    name: Joi.string().required(),
    description: Joi.string(),
    image: Joi.string().uri(),
  }),
};

const listCategorySchema = {
  query: Joi.object().keys({
    resultPerPage: Joi.number().integer().min(1).default(10).optional(),
    page: Joi.number().integer().min(1).default(1).optional(),
    q: Joi.string().optional(), // search query
  }),
};

const updateCategorySchema = {
  body: Joi.object<NSRestaurant.ICategory>()
    .keys({
      name: Joi.string(),
      description: Joi.string(),
      image: Joi.string().uri(),
    })
    .min(1),
  params: Joi.object().keys({
    id: commonValidation.ObjectIdSchema.required(),
  }),
};

export const categoryValidation = {
  createCategorySchema,
  updateCategorySchema,
  listCategorySchema,
};
