import { Router } from "express";
import { validate, authMiddleware, RBACMiddleware } from "../../middlewares";
import { authController, commonAuthController } from "../../controllers";
import { authValidation } from "../../utils/validations";
import { ROUTES } from "../../utils/routes";

export const customerAuthRouter = Router();

customerAuthRouter.post(
  ROUTES.customer.auth.signUp,
  validate(authValidation.SignUpSchema),
  authController.handleSignUp,
);
customerAuthRouter.post(
  ROUTES.customer.auth.signIn,
  validate(authValidation.SignInSchema),
  commonAuthController.handleSignIn("customer"),
);
customerAuthRouter.get(
  ROUTES.customer.auth.profile,
  authMiddleware,
  RBACMiddleware(["customer"]),
  commonAuthController.handleGetProfile("customer"),
);
customerAuthRouter.post(
  ROUTES.customer.auth.signOut,
  authMiddleware,
  RBACMiddleware(["customer"]),
  commonAuthController.handleSignOut("customer"),
);
customerAuthRouter.post(
  ROUTES.customer.auth.signOutAll,
  authMiddleware,
  RBACMiddleware(["customer"]),
  commonAuthController.handleSignOutAll("customer"),
);
customerAuthRouter.post(
  ROUTES.customer.auth.verifyEmail,
  authMiddleware,
  RBACMiddleware(["customer"]),
  validate(authValidation.VerifyEmailOTPSchema),
  commonAuthController.handleVerifyEmailOtp("customer"),
);
customerAuthRouter.post(
  ROUTES.customer.auth.resendEmailVerificationOTP,
  authMiddleware,
  RBACMiddleware(["customer"]),
  validate(authValidation.GenerateEmailOTPSchema),
  commonAuthController.handleGenerateEmailOTP("customer"),
);
customerAuthRouter.post(
  ROUTES.customer.auth.forgotPassword,
  validate(authValidation.ForgotPasswordSchema),
  commonAuthController.handleForgotPassword("customer"),
);
customerAuthRouter.patch(
  ROUTES.customer.auth.resetPassword,
  validate(authValidation.ResetPasswordSchema),
  commonAuthController.handleResetPassword("customer"),
);
