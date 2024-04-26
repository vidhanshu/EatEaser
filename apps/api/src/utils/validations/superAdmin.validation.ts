import Joi from "joi";
import { NSAdmin } from "../../types";
import { MOBILE_REGEX } from "../constants";
import { commonValidation } from "./common.validation";

const createAdminSchema = {
  body: Joi.object<NSAdmin.IAdminCreatePayload>().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(30).required(),
    name: Joi.string().min(3).max(50).required(),
    phone: Joi.string().min(10).required().pattern(MOBILE_REGEX),
  }),
  params: Joi.object<NSAdmin.IAdminCreatePayload>().keys({
    restaurantId: commonValidation.ObjectIdSchema.required(),
  }),
};

export const adminValidation = {
  createAdminSchema,
};
