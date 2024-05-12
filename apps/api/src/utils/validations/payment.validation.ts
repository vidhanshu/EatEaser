import Joi from "joi";
import { commonValidation } from "./common.validation";

const orderPaymentVerificationSchema = {
  body: Joi.object().keys({
    rzpPaymentId: Joi.string().required(),
    rzpSignature: Joi.string().required(),
    rzpOrderId: Joi.string().required(),
  }),
  ...commonValidation.idParamPayloadSchema,
};

const createRzpOrderSchema = {
  body: Joi.object().keys({
    amount: Joi.number().required(),
    orderId: Joi.string().required(),
  }),
};

export const paymentValidation = {
  orderPaymentVerificationSchema,
  createRzpOrderSchema,
};
