import Joi from "joi";
import { NSCommon } from "../../types";
import mongoose from "mongoose";

const listDataSchema = {
  query: Joi.object<NSCommon.IListDataPayload>().keys({
    resultPerPage: Joi.number().integer().min(1).default(10).optional(),
    page: Joi.number().integer().min(1).default(1).optional(),
  }),
};

const ObjectIdSchema = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
});

const idParamPayloadSchema = {
  params: Joi.object<NSCommon.IIdParamPayload>().keys({
    id: ObjectIdSchema.required(),
  }),
};

export const commonValidation = {
  listDataSchema,
  idParamPayloadSchema,
  ObjectIdSchema,
};
