import { Router } from "express";
import { RBACMiddleware, authMiddleware, validate } from "../../../middlewares";
import { ROUTES } from "../../../utils/routes";
import {
  commonValidation,
  menuItemValidation,
} from "../../../utils/validations";
import { commonMenuItemController } from "../../../controllers";

export const customerMenuItemRouter = Router();

customerMenuItemRouter.get(
  ROUTES.customer.restaurant.menuItem.list,
  authMiddleware,
  RBACMiddleware(["customer"]),
  validate(menuItemValidation.listMenuItemsSchema),
  commonMenuItemController.handleListItems("customer")
);
customerMenuItemRouter.get(
  ROUTES.customer.restaurant.menuItem.byId,
  authMiddleware,
  RBACMiddleware(["customer"]),
  validate(commonValidation.idParamPayloadSchema),
  commonMenuItemController.handleGetItemById("customer")
);
