import { Router } from "express";
import { paymentController } from "../controllers/common/payment.controller";
import { RBACMiddleware, authMiddleware, validate } from "../middlewares";
import { ROUTES } from "../utils/routes";
import { paymentValidation } from "../utils/validations";

export const paymentRouter = Router();

paymentRouter.post(
  ROUTES.customer.restaurant.order.verifyPayment,
  validate(paymentValidation.orderPaymentVerificationSchema),
  authMiddleware,
  RBACMiddleware(["customer"]),
  paymentController.orderPaymentVerification,
);

paymentRouter.post(
  ROUTES.customer.restaurant.order.createRzpOrder,
  validate(paymentValidation.createRzpOrderSchema),
  authMiddleware,
  RBACMiddleware(["customer"]),
  paymentController.createRzpOrder,
);
