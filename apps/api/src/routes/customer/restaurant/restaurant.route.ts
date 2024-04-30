import { Router } from "express";
import { ROUTES } from "../../../utils/routes";
import { validate } from "../../../middlewares";
import { commonRestaurantController } from "../../../controllers";
import { restaurantValidation } from "../../../utils/validations";

export const customerRestaurantRouter = Router();

customerRestaurantRouter.get(
  ROUTES.customer.restaurant.byId,
  validate(restaurantValidation.getRestaurantByIdSchema),
  commonRestaurantController.handleGetRestaurantById("customer")
);
customerRestaurantRouter.get(
  ROUTES.customer.restaurant.list,
  validate(restaurantValidation.listRestaurantSchema),
  commonRestaurantController.handleListRestaurant("customer")
);
