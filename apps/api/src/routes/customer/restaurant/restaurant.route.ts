import { Router } from "express";
import { ROUTES } from "../../../utils/routes";
import { validate } from "../../../middlewares";
import { commonRestaurantController } from "../../../controllers";
import { commonValidation } from "../../../utils/validations";

export const customerRestaurantRouter = Router();

customerRestaurantRouter.get(
  ROUTES.customer.restaurant.byId,
  validate(commonValidation.idParamPayloadSchema),
  commonRestaurantController.handleGetRestaurantById("customer")
);
customerRestaurantRouter.get(
  ROUTES.customer.restaurant.list,
  validate(commonValidation.listDataSchema),
  commonRestaurantController.handleListRestaurant("customer")
);
