import { Router } from "express";
import { RBACMiddleware, authMiddleware, validate } from "../../../middlewares";
import {
  adminAddOnController,
  commonAddOnController,
} from "../../../controllers";
import { commonValidation, addOnValidation } from "../../../utils/validations";
import { ROUTES } from "../../../utils/routes";

export const adminAddOnRouter = Router();

adminAddOnRouter.post(
  ROUTES.admin.restaurant.addOn.create,
  authMiddleware,
  RBACMiddleware(["admin"]),
  validate(addOnValidation.createAddonSchema),
  adminAddOnController.handleCreateAddOn
);
adminAddOnRouter.get(
  ROUTES.admin.restaurant.addOn.byId,
  authMiddleware,
  RBACMiddleware(["admin"]),
  validate(commonValidation.idParamPayloadSchema),
  commonAddOnController.handleGetAddOnById("admin")
);
adminAddOnRouter.get(
  ROUTES.admin.restaurant.addOn.list,
  authMiddleware,
  RBACMiddleware(["admin"]),
  validate(addOnValidation.listAddonSchema),
  commonAddOnController.handleListAddOn("admin")
);
adminAddOnRouter.delete(
  ROUTES.admin.restaurant.addOn.delete,
  authMiddleware,
  RBACMiddleware(["admin"]),
  validate(commonValidation.idParamPayloadSchema),
  adminAddOnController.handleDeleteAddOnById
);
adminAddOnRouter.patch(
  ROUTES.admin.restaurant.addOn.update,
  authMiddleware,
  RBACMiddleware(["admin"]),
  validate(addOnValidation.updateAddonSchema),
  adminAddOnController.handleUpdateAddOnById
);
