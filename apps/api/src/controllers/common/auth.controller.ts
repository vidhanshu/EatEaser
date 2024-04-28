import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import { Request, Response } from "express";
import { NSCommon, NSAuth } from "../../types";
import { User } from "../../models";
import {
  generateToken,
  isValidJWT,
  verifyJWT,
  generateOTP,
  getClientDomain,
} from "../../utils/helpers";
import {
  MAX_SESSIONS_ALLOWED_PER_USER,
  OTP_EXPIRES_IN_FROM_NOW,
  RESET_PASSWORD_TOKEN_EXPIRES_IN,
} from "../../utils/constants";
import { transport, config, redis } from "../../configs";
import {
  EMAIL_VERIFICATION_OTP_TEMPLATE,
  RESET_PASSWORD_TEMPALTE,
} from "../../utils/templates";
import {
  ResponseError,
  sendErrorResponse,
  sendResponse,
} from "../../utils/response";

const handleSignIn = (role: NSAuth.ROLES) => {
  return async (
    req: NSCommon.TypedRequest<NSAuth.IUserSigninPayload>,
    res: Response
  ) => {
    const { email, password } = req.body;
    try {
      let user: any = null;
      if (role === "customer" || role == "super-admin") {
        user = await User.findOne({ email, role });
      } else {
        user = await User.findOne({ email, role }).populate("restaurant", {
          id: 1,
          name: 1,
        });
      }
      if (!user)
        throw new ResponseError(
          "Invalid email or password",
          httpStatus.UNAUTHORIZED
        );

      const passwordMatched = await bcrypt.compare(password!, user.password);
      if (!passwordMatched) {
        throw new ResponseError(
          "Invalid email or password",
          httpStatus.UNAUTHORIZED
        );
      }
      const token = generateToken({ _id: user._id.toString() });
      const sessions = await redis.llen(`accessTokens:${user._id}`);
      if (sessions >= MAX_SESSIONS_ALLOWED_PER_USER) {
        // remove the oldest token from the list
        await redis.rpop(`accessTokens:${user._id}`);
      }
      await redis.lpush(`accessTokens:${user._id}`, token);
      await user.save();

      sendResponse(res, {
        token,
        data: user,
        message: "Sign in successful",
      });
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };
};

const handleGetProfile = (role: NSAuth.ROLES) => {
  return async (req: NSCommon.IAuthRequest, res: Response) => {
    try {
      const _id = req._id;
      let user: any = null;
      if (role === "customer" || role === "super-admin") {
        user = await User.findById(_id, { password: 0 });
      } else {
        user = await User.findById(_id, {
          password: 0,
        }).populate("restaurant", { _id: 1, name: 1 });
      }
      if (!user) {
        throw new ResponseError("User not found", httpStatus.BAD_REQUEST);
      }
      sendResponse(res, { data: user });
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };
};

const handleSignOut = (role: NSAuth.ROLES) => {
  return async (req: NSCommon.IAuthRequest, res: Response) => {
    try {
      const user = await User.findById(req._id, {
        _id: 1,
        accessTokens: 1,
      });
      if (!user) {
        throw new ResponseError("User not found!", httpStatus.NOT_FOUND);
      }
      // delete the access token of this user from the redis list
      await redis.lrem(`accessTokens:${user._id}`, 0, req.token!);
      await user.save();
      sendResponse(res, {
        message: "Sign out successful",
      });
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };
};

const handleSignOutAll = (role: NSAuth.ROLES) => {
  return async (req: NSCommon.IAuthRequest, res: Response) => {
    try {
      const user = await User.findById(req._id, { _id: 1 });
      if (!user) {
        throw new ResponseError("User not found!", httpStatus.NOT_FOUND);
      }
      // delete all the access token of this user from the redis list
      await redis.del(`accessTokens:${user._id}`);
      await user.save();
      sendResponse(res, {
        message: "Sign out successful from all devices",
      });
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };
};

const handleVerifyEmailOtp = (role: NSAuth.ROLES) => {
  return async (
    req: NSCommon.TypedRequest<NSAuth.IVerifyEmailOTPPayload> &
      NSCommon.IAuthRequest,
    res: Response
  ) => {
    try {
      const { otp, email } = req.body;

      // check if email is already verified & if user exists
      const existingUser = await User.findOne(
        { email, _id: req._id },
        { isEmailVerified: 1, email: 1 }
      );
      if (!existingUser) {
        throw new ResponseError("User not found", httpStatus.NOT_FOUND);
      }
      if (email !== existingUser.email) {
        throw new ResponseError("Invalid email", httpStatus.BAD_REQUEST);
      }
      if (existingUser.isEmailVerified) {
        throw new ResponseError(
          "Email already verified",
          httpStatus.BAD_REQUEST
        );
      }

      const storedOtp = await redis.get(`emailVerificationOTP:${email}`);

      // checking if otp exists or not
      if (!storedOtp) {
        throw new ResponseError("Invalid OTP", httpStatus.BAD_REQUEST);
      }

      // checking if otp is correct or not, check only values not type
      if (storedOtp != otp) {
        throw new ResponseError("Invalid OTP", httpStatus.BAD_REQUEST);
      }

      const user = await User.findOneAndUpdate(
        { email },
        { isEmailVerified: true },
        { new: true }
      );

      if (!user) {
        throw new ResponseError("User not found", httpStatus.NOT_FOUND);
      }

      await redis.del(`emailVerificationOTP:${email}`);
      sendResponse(res, { message: "Email verified successfully" });
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };
};

const handleGenerateEmailOTP = (role: NSAuth.ROLES) => {
  return async (
    req: NSCommon.TypedRequest<NSAuth.IGenerateEmailOTPPayload> &
      NSCommon.IAuthRequest,
    res: Response
  ) => {
    try {
      const { email } = req.body;

      // check if user with given id exists
      const user = await User.findOne(
        { email, _id: req._id },
        { email: 1, isEmailVerified: 1, name: 1 }
      );
      if (!user) {
        throw new ResponseError("User not found", httpStatus.NOT_FOUND);
      }

      // check if email already verified
      if (user.isEmailVerified) {
        throw new ResponseError(
          "Email already verified",
          httpStatus.BAD_REQUEST
        );
      }

      const storedOtp = await redis.get(`emailVerificationOTP:${email}`);
      // check if otp already exists and not expired
      if (storedOtp) {
        return res.status(httpStatus.BAD_REQUEST).json({
          error: "OTP already sent to this email",
        });
      }

      const otp = generateOTP(4);
      await redis.setex(
        `emailVerificationOTP:${email}`,
        OTP_EXPIRES_IN_FROM_NOW,
        otp
      );

      transport.sendMail({
        from: `EatEasers <${config.email.gmail_id}>`,
        to: user.email,
        subject: "Email verification",
        html: EMAIL_VERIFICATION_OTP_TEMPLATE(otp, user.name),
      });

      sendResponse(res, { message: "OTP sent successfully" });
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };
};

const handleForgotPassword = (role: NSAuth.ROLES) => {
  return async (
    req: NSCommon.TypedRequest<NSAuth.IForgotPasswordPayload>,
    res: Response
  ) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      if (!user || !user.isEmailVerified) {
        throw new ResponseError(
          "User not found or email not verified",
          httpStatus.BAD_REQUEST
        );
      }

      const storedPasswordResetToken = (await redis.get(
        `passwordResetToken:${email}`
      )) as string | null;

      // check if already password reset link sent
      if (storedPasswordResetToken && isValidJWT(storedPasswordResetToken)) {
        throw new ResponseError(
          "Reset link already sent to your email",
          httpStatus.BAD_REQUEST
        );
      }

      const resetToken = generateToken(
        { _id: user._id.toString() },
        RESET_PASSWORD_TOKEN_EXPIRES_IN
      );
      // store reset token in redis, with 5 minutes expiry
      await redis.setex(`passwordResetToken:${email}`, 300, resetToken);

      // send email with reset link
      transport.sendMail({
        from: `EatEasers <${config.email.gmail_id}>`,
        to: user.email,
        subject: "Reset password",
        html: RESET_PASSWORD_TEMPALTE(
          resetToken,
          user.name,
          getClientDomain(req as Request)
        ),
      });

      sendResponse(res, {
        message: "Email with reset link is send to your email id",
      });
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };
};

const handleResetPassword = (role: NSAuth.ROLES) => {
  return async (
    req: NSCommon.TypedRequest<
      Omit<NSAuth.IResetTokenPayload, "reset_token">,
      { reset_token: string }
    >,
    res: Response
  ) => {
    try {
      const { password } = req.body;
      const resetToken = req.query.reset_token;

      if (!resetToken || !isValidJWT(resetToken as string)) {
        throw new ResponseError("Invalid reset token", httpStatus.BAD_REQUEST);
      }

      const { _id } = verifyJWT(resetToken);
      const user = await User.findById(_id);
      if (!user) {
        throw new ResponseError("User not found", httpStatus.NOT_FOUND);
      }

      const storedPasswordResetToken = await redis.get(
        `passwordResetToken:${user.email}`
      );
      // check if there is no password reset token or if exists then it's valid
      if (
        !storedPasswordResetToken ||
        storedPasswordResetToken !== resetToken
      ) {
        throw new ResponseError("Invalid reset token", httpStatus.BAD_REQUEST);
      }

      user.password = password!;
      // invalidate the reset token
      await redis.del(`passwordResetToken:${user.email}`);
      // logout user from all devices, for this user
      await redis.del(`accessTokens:${_id}`);
      await user.save();

      if (process.env.NODE_ENV === "production") {
        transport.sendMail({
          from: `EatEasers <${config.email.gmail_id}>`,
          to: user.email,
          subject: "Password reset",
          html: "Your password has been reset successfully",
        });
      }

      sendResponse(res, {
        message: "Password reset successfully, please login now",
        statusCode: httpStatus.OK,
      });
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };
};

const handleUpdateProfile = (role: NSAuth.ROLES) => {
  return async (
    req: NSCommon.TypedRequest<NSAuth.IUpdateProfilePayload> &
      NSCommon.IAuthRequest,
    res: Response
  ) => {
    try {
      const { name, email, phone, image, newPassword, currentPassword } =
        req.body;
      const user = await User.findById(req._id);
      if (!user) {
        throw new ResponseError("User not found", httpStatus.NOT_FOUND);
      }
      if (email && email !== user.email) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new ResponseError(
            "Email already exists",
            httpStatus.BAD_REQUEST
          );
        }
      }
      if (name) user.name = name;
      if (email) user.email = email;
      if (phone) user.phone = phone;
      if (image) user.image = image;

      if (newPassword && currentPassword) {
        const passwordMatched = await bcrypt.compare(
          currentPassword,
          user.password
        );
        if (!passwordMatched) {
          throw new ResponseError(
            "Invalid current password",
            httpStatus.BAD_REQUEST
          );
        }
        user.password = newPassword;
      }
      const newUser = await user.save();
      sendResponse(res, {
        message: "Profile updated successfully",
        data: newUser,
      });
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };
};

export const commonAuthController = {
  handleSignIn,
  handleGetProfile,
  handleSignOut,
  handleSignOutAll,
  handleVerifyEmailOtp,
  handleUpdateProfile,
  handleGenerateEmailOTP,
  handleForgotPassword,
  handleResetPassword,
};
