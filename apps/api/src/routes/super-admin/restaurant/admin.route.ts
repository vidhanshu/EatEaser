import { Router } from "express";
import { ROUTES } from "../../../utils/routes";
import { validate, authMiddleware, RBACMiddleware } from "../../../middlewares";
import { superAdminAdminController } from "../../../controllers";
import { adminValidation } from "../../../utils/validations";

export const superAdminAdminRouter = Router();

superAdminAdminRouter.post(
  ROUTES.superAdmin.restaurant.admin.create,
  authMiddleware,
  RBACMiddleware(["super-admin"]),
  validate(adminValidation.createAdminSchema),
  superAdminAdminController.handleCreateAdmin,
);
