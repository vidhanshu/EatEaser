import Joi from "joi";
import { commonValidation } from "../common.validation";

const listCategoriesSchema = {
  params: Joi.object().keys({
    restaurantId: Joi.string().required(),
  }),
  query: commonValidation.listDataSchema.query,
};

export const customerCategoryValidation = { listCategoriesSchema };
