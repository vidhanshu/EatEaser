import { Router } from "express";
import { ROUTES } from "../../../utils/routes";
import { RBACMiddleware, authMiddleware, validate } from "../../../middlewares";
import { commonValidation, orderValidation } from "../../../utils/validations";
import {
  adminOrderController,
  commonOrderController,
} from "../../../controllers";

export const adminOrderRouter = Router();

adminOrderRouter.patch(
  ROUTES.admin.restaurant.order.update,
  authMiddleware,
  RBACMiddleware(["admin"]),
  validate(orderValidation.updateOrderSchema),
  adminOrderController.handleUpdateOrder
);

adminOrderRouter.get(
  ROUTES.admin.restaurant.order.list,
  authMiddleware,
  RBACMiddleware(["admin"]),
  validate(orderValidation.listOrderSchema),
  adminOrderController.handleListOrder
);

adminOrderRouter.get(
  ROUTES.admin.restaurant.order.byId,
  authMiddleware,
  RBACMiddleware(["admin"]),
  validate(commonValidation.idParamPayloadSchema),
  commonOrderController.handleGetById("admin")
);
