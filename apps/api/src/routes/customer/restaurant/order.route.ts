import { Router } from "express";
import { ROUTES } from "../../../utils/routes";
import { RBACMiddleware, authMiddleware, validate } from "../../../middlewares";
import {
  commonValidation,
  customerOrderValidation,
  orderValidation,
} from "../../../utils/validations";
import {
  commonOrderController,
  customerOrderController,
} from "../../../controllers";

export const customerOrderRouter = Router();

customerOrderRouter.post(
  ROUTES.customer.restaurant.order.create,
  authMiddleware,
  RBACMiddleware(["customer"]),
  validate(customerOrderValidation.createOrderSchema),
  customerOrderController.handleCreateOrder
);
customerOrderRouter.patch(
  ROUTES.customer.restaurant.order.update,
  authMiddleware,
  RBACMiddleware(["customer"]),
  validate(customerOrderValidation.updateOrderSchema),
  customerOrderController.handleUpdateOrder
);
customerOrderRouter.get(
  ROUTES.customer.restaurant.order.list,
  authMiddleware,
  RBACMiddleware(["customer"]),
  validate(orderValidation.listOrderSchema),
  customerOrderController.listOrders
);
customerOrderRouter.get(
  ROUTES.customer.restaurant.order.byId,
  authMiddleware,
  RBACMiddleware(["customer"]),
  validate(commonValidation.idParamPayloadSchema),
  commonOrderController.handleGetById("customer")
);
customerOrderRouter.patch(
  ROUTES.customer.restaurant.order.cancel,
  authMiddleware,
  RBACMiddleware(["customer"]),
  customerOrderController.handleCancelOrder
);
