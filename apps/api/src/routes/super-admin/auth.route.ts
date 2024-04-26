import { Router } from "express";
import { validate, authMiddleware, RBACMiddleware } from "../../middlewares";
import { commonAuthController } from "../../controllers";
import { authValidation } from "../../utils/validations";
import { ROUTES } from "../../utils/routes";

export const superAdminAuthRouter = Router();

superAdminAuthRouter.post(
  ROUTES.superAdmin.auth.signIn,
  validate(authValidation.SignInSchema),
  commonAuthController.handleSignIn("super-admin"),
);
superAdminAuthRouter.get(
  ROUTES.superAdmin.auth.profile,
  authMiddleware,
  RBACMiddleware(["super-admin"]),
  commonAuthController.handleGetProfile("super-admin"),
);
superAdminAuthRouter.post(
  ROUTES.superAdmin.auth.signOut,
  authMiddleware,
  RBACMiddleware(["super-admin"]),
  commonAuthController.handleSignOut("super-admin"),
);
superAdminAuthRouter.post(
  ROUTES.superAdmin.auth.signOutAll,
  authMiddleware,
  RBACMiddleware(["super-admin"]),
  commonAuthController.handleSignOutAll("super-admin"),
);
superAdminAuthRouter.post(
  ROUTES.superAdmin.auth.verifyEmail,
  authMiddleware,
  RBACMiddleware(["super-admin"]),
  validate(authValidation.VerifyEmailOTPSchema),
  commonAuthController.handleVerifyEmailOtp("super-admin"),
);
superAdminAuthRouter.post(
  ROUTES.superAdmin.auth.resendEmailVerificationOTP,
  authMiddleware,
  RBACMiddleware(["super-admin"]),
  validate(authValidation.GenerateEmailOTPSchema),
  commonAuthController.handleGenerateEmailOTP("super-admin"),
);
superAdminAuthRouter.post(
  ROUTES.superAdmin.auth.forgotPassword,
  validate(authValidation.ForgotPasswordSchema),
  commonAuthController.handleForgotPassword("super-admin"),
);
superAdminAuthRouter.patch(
  ROUTES.superAdmin.auth.resetPassword,
  validate(authValidation.ResetPasswordSchema),
  commonAuthController.handleResetPassword("super-admin"),
);
