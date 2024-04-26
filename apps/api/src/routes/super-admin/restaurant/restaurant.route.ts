import { Router } from "express";
import { ROUTES } from "../../../utils/routes";
import { validate, authMiddleware, RBACMiddleware } from "../../../middlewares";
import { superAdminRestaurantController } from "../../../controllers";
import {
  restaurantValidation,
  commonValidation,
} from "../../../utils/validations";

export const superAdminRestaurantRouter = Router();

superAdminRestaurantRouter.post(
  ROUTES.superAdmin.restaurant.create,
  authMiddleware,
  RBACMiddleware(["super-admin"]),
  validate(restaurantValidation.createRestaurantSchema),
  superAdminRestaurantController.handleCreateRestaurant
);
superAdminRestaurantRouter.get(
  ROUTES.superAdmin.restaurant.list,
  authMiddleware,
  RBACMiddleware(["super-admin"]),
  validate(commonValidation.listDataSchema),
  superAdminRestaurantController.handleListRestaurant
);
