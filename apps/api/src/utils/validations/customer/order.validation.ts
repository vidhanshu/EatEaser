import Joi from "joi";
import { commonValidation } from "../common.validation";

const createOrderSchema = {
  body: Joi.object().keys({
    items: Joi.array()
      .items(
        Joi.object({
          item: commonValidation.ObjectIdSchema.required(),
          quantity: Joi.number().required(),
          addons: Joi.array().items(Joi.string()),
        })
      )
      .min(1)
      .required(),
    paymentMethod: Joi.string()
      .valid("CASH", "CARD", "NETBANKING", "UPI")
      .required(),
  }),
  query: Joi.object().keys({
    restaurantId: commonValidation.ObjectIdSchema.required(),
    tableId: commonValidation.ObjectIdSchema.required(),
  }),
};

const updateOrderSchema = {
  body: Joi.object()
    .keys({
      items: Joi.array()
        .items(
          Joi.object({
            item: commonValidation.ObjectIdSchema.required(),
            quantity: Joi.number().required(),
            addons: Joi.array().items(Joi.string()),
          })
        )
        .min(1),
      paymentMethod: Joi.string().valid("CASH", "CARD", "NETBANKING", "UPI"),
    })
    .min(1),
  ...commonValidation.idParamPayloadSchema,
};

export const customerOrderValidation = { createOrderSchema, updateOrderSchema };
