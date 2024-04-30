import Joi from "joi";
import { NSRestaurant } from "../../../types";
import { commonValidation } from "../common.validation";

const createTableSchema = {
  body: Joi.object<NSRestaurant.ITable>().keys({
    name: Joi.string().max(100).required(),
    description: Joi.string(),
    capacity: Joi.number().required(),
    status: Joi.string().valid("AVAILABLE", "RESERVED", "OCCUPIED"),
  }),
};

const updateTableSchema = {
  body: Joi.object<NSRestaurant.ITable>()
    .keys({
      name: Joi.string(),
      description: Joi.string(),
      capacity: Joi.number(),
      restaurant: Joi.string(),
      status: Joi.string().valid("AVAILABLE", "RESERVED", "OCCUPIED"),
    })
    .min(1),
  params: Joi.object().keys({
    id: commonValidation.ObjectIdSchema.required(),
  }),
};

export const customerListTablesSchema = {
  ...commonValidation.idParamPayloadSchema,
  query: Joi.object().keys({
    ...commonValidation.listDataSchema,
    status: Joi.string().optional().valid("AVAILABLE", "RESERVED", "OCCUPIED"),
  }),
};

export const tableValidation = {
  createTableSchema,
  updateTableSchema,
  customerListTablesSchema,
};
