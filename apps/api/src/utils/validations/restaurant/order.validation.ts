import Joi from "joi";
import { NSRestaurant } from "../../../types";
import { ORDER_STATUS, PAYMENT_METHODS, PAYMENT_STATUS } from "../../constants";
import { commonValidation } from "../common.validation";

export interface IListOrderSchema {
  page: number;
  resultPerPage: number;
  startTime: Date;
  endTime: Date;
  status: string;
}
const listOrderSchema = {
  query: Joi.object<IListOrderSchema>().keys({
    page: Joi.number().min(1),
    resultPerPage: Joi.number().min(1).max(100),
    startTime: Joi.date(),
    endTime: Joi.date(),
    status: Joi.string().valid(...ORDER_STATUS),
  }),
};

export type IUpdateOrderSchema = Pick<
  NSRestaurant.IOrder,
  "items" | "status"
> & {
  paymentMethod: NSRestaurant.PAYMENT_METHOD;
  paymentStatus: NSRestaurant.PAYMENT_STATUS;
  transactionId: string;
  status: NSRestaurant.ORDER_STATUS;
};
const updateOrderSchema = {
  body: Joi.object<IUpdateOrderSchema>()
    .keys({
      items: Joi.array()
        .items(
          Joi.object({
            item: Joi.string().required(),
            quantity: Joi.number().required(),
            addons: Joi.array().items(Joi.string()),
          })
        )
        .min(1),
      paymentMethod: Joi.string().valid(...PAYMENT_METHODS),
      paymentStatus: Joi.string().valid(...PAYMENT_STATUS),
      transactionId: Joi.string(),
      status: Joi.string().valid(...ORDER_STATUS),
    })
    .min(1),
  ...commonValidation.idParamPayloadSchema,
};

export const orderValidation = {
  listOrderSchema,
  updateOrderSchema,
};
