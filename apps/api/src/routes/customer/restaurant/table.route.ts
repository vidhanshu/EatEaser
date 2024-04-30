import { Router } from "express";
import { ROUTES } from "../../../utils/routes";
import { RBACMiddleware, authMiddleware, validate } from "../../../middlewares";
import { commonValidation, tableValidation } from "../../../utils/validations";
import { commonTableController } from "../../../controllers";

export const customerTableRouter = Router();

customerTableRouter.get(
  ROUTES.customer.restaurant.table.byId,
  authMiddleware,
  RBACMiddleware(["customer"]),
  validate(commonValidation.idParamPayloadSchema),
  commonTableController.handleGetTableById("customer")
);
customerTableRouter.get(
  ROUTES.customer.restaurant.table.list,
  authMiddleware,
  RBACMiddleware(["customer"]),
  validate(tableValidation.customerListTablesSchema),
  commonTableController.handelListTable("customer")
);
