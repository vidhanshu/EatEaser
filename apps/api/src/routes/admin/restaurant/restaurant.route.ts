import { Router } from "express";
import { validate, authMiddleware, RBACMiddleware } from "../../../middlewares";
import { adminRestaurantController } from "../../../controllers";
import { restaurantValidation } from "../../../utils/validations";
import { ROUTES } from "../../../utils/routes";

export const adminRestaurantRouter = Router();

adminRestaurantRouter.get(
  ROUTES.admin.restaurant.myRestaurant,
  authMiddleware,
  RBACMiddleware(["admin"]),
  adminRestaurantController.handleGetMyRestaurant,
);
adminRestaurantRouter.patch(
  ROUTES.admin.restaurant.update,
  authMiddleware,
  RBACMiddleware(["admin"]),
  validate(restaurantValidation.updateRestaurantSchema),
  adminRestaurantController.handleUpdateRestaurant,
);
