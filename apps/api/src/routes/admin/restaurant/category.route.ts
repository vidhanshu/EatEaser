import { Router } from "express";
import { RBACMiddleware, authMiddleware, validate } from "../../../middlewares";
import {
  adminCategoryController,
  commonCategoryController,
} from "../../../controllers";
import {
  commonValidation,
  categoryValidation,
} from "../../../utils/validations";
import { ROUTES } from "../../../utils/routes";

export const adminCategoryRouter = Router();

adminCategoryRouter.post(
  ROUTES.admin.restaurant.category.create,
  authMiddleware,
  RBACMiddleware(["admin"]),
  validate(categoryValidation.createCategorySchema),
  adminCategoryController.handleCreateCategory
);
adminCategoryRouter.get(
  ROUTES.admin.restaurant.category.byId,
  authMiddleware,
  RBACMiddleware(["admin"]),
  validate(commonValidation.idParamPayloadSchema),
  commonCategoryController.handleGetCategoryById("admin")
);
adminCategoryRouter.get(
  ROUTES.admin.restaurant.category.list,
  authMiddleware,
  RBACMiddleware(["admin"]),
  validate(categoryValidation.listCategorySchema),
  commonCategoryController.handleListCategories("admin")
);
adminCategoryRouter.delete(
  ROUTES.admin.restaurant.category.delete,
  authMiddleware,
  RBACMiddleware(["admin"]),
  validate(commonValidation.idParamPayloadSchema),
  adminCategoryController.handleDeleteCategoryById
);
adminCategoryRouter.patch(
  ROUTES.admin.restaurant.category.update,
  authMiddleware,
  RBACMiddleware(["admin"]),
  validate(categoryValidation.updateCategorySchema),
  adminCategoryController.handleUpdateCategoryById
);
