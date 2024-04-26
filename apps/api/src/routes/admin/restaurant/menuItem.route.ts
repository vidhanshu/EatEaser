import { Router } from "express";
import { RBACMiddleware, authMiddleware, validate } from "../../../middlewares";
import {
  adminMenuItemController,
  commonMenuItemController,
} from "../../../controllers";
import { commonValidation, menuItemValidation } from "../../../utils/validations";
import { ROUTES } from "../../../utils/routes";

export const adminMenuItemRouter = Router();

adminMenuItemRouter.post(
  ROUTES.admin.restaurant.menuItem.create,
  authMiddleware,
  RBACMiddleware(["admin"]),
  validate(menuItemValidation.createMenuItemSchema),
  adminMenuItemController.handleCreateItem
);
adminMenuItemRouter.get(
  ROUTES.admin.restaurant.menuItem.byId,
  authMiddleware,
  RBACMiddleware(["admin"]),
  commonMenuItemController.handleGetItemById("admin")
);
adminMenuItemRouter.get(
  ROUTES.admin.restaurant.menuItem.list,
  authMiddleware,
  RBACMiddleware(["admin"]),
  validate(menuItemValidation.listMenuItemsSchema),
  commonMenuItemController.handleListItems("admin")
);
adminMenuItemRouter.delete(
  ROUTES.admin.restaurant.menuItem.delete,
  authMiddleware,
  RBACMiddleware(["admin"]),
  validate(commonValidation.idParamPayloadSchema),
  adminMenuItemController.handleDeleteItemById
);
adminMenuItemRouter.patch(
  ROUTES.admin.restaurant.menuItem.update,
  authMiddleware,
  RBACMiddleware(["admin"]),
  validate(menuItemValidation.updateMenuItemSchema),
  adminMenuItemController.handleUpdateItemById
);
