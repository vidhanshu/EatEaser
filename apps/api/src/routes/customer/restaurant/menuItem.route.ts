import { Router } from "express";
import { validate } from "../../../middlewares";
import { ROUTES } from "../../../utils/routes";
import {
  commonValidation,
  menuItemValidation,
} from "../../../utils/validations";
import { commonMenuItemController } from "../../../controllers";

export const customerMenuItemRouter = Router();

customerMenuItemRouter.get(
  ROUTES.customer.restaurant.menuItem.list,
  validate(menuItemValidation.listMenuItemsSchema),
  commonMenuItemController.handleListItems("customer")
);
customerMenuItemRouter.get(
  ROUTES.customer.restaurant.menuItem.byId,
  validate(commonValidation.idParamPayloadSchema),
  commonMenuItemController.handleGetItemById("customer")
);
