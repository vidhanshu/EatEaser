import { Router } from "express";
import { commonAuthController } from "../../controllers";
import { validate, authMiddleware, RBACMiddleware } from "../../middlewares";
import { authValidation } from "../../utils/validations";
import { ROUTES } from "../../utils/routes";

export const adminAuthRouter = Router();

adminAuthRouter.post(
  ROUTES.admin.auth.signIn,
  validate(authValidation.SignInSchema),
  commonAuthController.handleSignIn("admin"),
);
adminAuthRouter.get(
  ROUTES.admin.auth.profile,
  authMiddleware,
  RBACMiddleware(["admin"]),
  commonAuthController.handleGetProfile("admin"),
);
adminAuthRouter.post(
  ROUTES.admin.auth.signOut,
  authMiddleware,
  RBACMiddleware(["admin"]),
  commonAuthController.handleSignOut("admin"),
);
adminAuthRouter.post(
  ROUTES.admin.auth.signOutAll,
  authMiddleware,
  RBACMiddleware(["admin"]),
  commonAuthController.handleSignOutAll("admin"),
);
adminAuthRouter.post(
  ROUTES.admin.auth.verifyEmail,
  authMiddleware,
  RBACMiddleware(["admin"]),
  validate(authValidation.VerifyEmailOTPSchema),
  commonAuthController.handleVerifyEmailOtp("admin"),
);
adminAuthRouter.post(
  ROUTES.admin.auth.resendEmailVerificationOTP,
  authMiddleware,
  RBACMiddleware(["admin"]),
  validate(authValidation.GenerateEmailOTPSchema),
  commonAuthController.handleGenerateEmailOTP("admin"),
);
adminAuthRouter.post(
  ROUTES.admin.auth.forgotPassword,
  validate(authValidation.ForgotPasswordSchema),
  commonAuthController.handleForgotPassword("admin"),
);
adminAuthRouter.patch(
  ROUTES.admin.auth.resetPassword,
  validate(authValidation.ResetPasswordSchema),
  commonAuthController.handleResetPassword("admin"),
);
