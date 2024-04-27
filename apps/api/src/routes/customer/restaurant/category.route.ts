import { Router } from "express";
import { ROUTES } from "../../../utils/routes";
import { commonCategoryController } from "../../../controllers";
import { validate } from "../../../middlewares";
import {
  commonValidation,
  customerCategoryValidation,
} from "../../../utils/validations";

export const customerCategoryRouter = Router();

customerCategoryRouter.get(
  ROUTES.customer.restaurant.category.byId,
  validate(commonValidation.idParamPayloadSchema),
  commonCategoryController.handleGetCategoryById("customer")
);
customerCategoryRouter.get(
  ROUTES.customer.restaurant.category.list,
  validate(customerCategoryValidation.listCategoriesSchema),
  commonCategoryController.handleListCategories("customer")
);
