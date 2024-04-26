import { Router } from "express";
import { RBACMiddleware, authMiddleware, validate } from "../../../middlewares";
import {
  adminTableController,
  commonTableController,
} from "../../../controllers";
import { commonValidation, tableValidation } from "../../../utils/validations";
import { ROUTES } from "../../../utils/routes";

export const adminTableRouter = Router();

adminTableRouter.post(
  ROUTES.admin.restaurant.table.create,
  authMiddleware,
  RBACMiddleware(["admin"]),
  validate(tableValidation.createTableSchema),
  adminTableController.handleCreateTable,
);
adminTableRouter.get(
  ROUTES.admin.restaurant.table.byId,
  authMiddleware,
  RBACMiddleware(["admin"]),
  validate(commonValidation.idParamPayloadSchema),
  commonTableController.handleGetTableById("admin"),
);
adminTableRouter.get(
  ROUTES.admin.restaurant.table.list,
  authMiddleware,
  RBACMiddleware(["admin"]),
  validate(commonValidation.listDataSchema),
  commonTableController.handelListTable("admin"),
);
adminTableRouter.delete(
  ROUTES.admin.restaurant.table.delete,
  authMiddleware,
  RBACMiddleware(["admin"]),
  validate(commonValidation.idParamPayloadSchema),
  adminTableController.handleDeleteTableById,
);
adminTableRouter.patch(
  ROUTES.admin.restaurant.table.update,
  authMiddleware,
  RBACMiddleware(["admin"]),
  validate(tableValidation.updateTableSchema),
  adminTableController.handleUpdateTableById,
);
