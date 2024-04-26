import httpStatus from "http-status";
import { Response } from "express";
import { NSCommon, NSAuth } from "../../types";
import { User } from "../../models";
import { generateToken } from "../../utils/helpers";
import { generateOTP } from "../../utils/helpers";
import { OTP_EXPIRES_IN_FROM_NOW } from "../../utils/constants";
import { transport } from "../../configs";
import { config } from "../../configs";
import { EMAIL_VERIFICATION_OTP_TEMPLATE } from "../../utils/templates";
import {
  ResponseError,
  sendErrorResponse,
  sendResponse,
} from "../../utils/response";
import { redis } from "../../configs";

const handleSignUp = async (
  req: NSCommon.TypedRequest<NSAuth.IUserSignupPayload>,
  res: Response,
) => {
  const { email, name, password, phone } = req.body;

  try {
    const customer = await User.findOne(
      { $or: [{ email }, { phone }] },
      { _id: 1 },
    );
    if (customer) {
      throw new ResponseError(
        "User already exists with this email or phone number.",
        httpStatus.CONFLICT,
      );
    }
    const newCustomer = new User({ name, email, phone, password });
    const token = generateToken({ _id: newCustomer._id.toString() });
    await redis.lpush(`accessTokens:${newCustomer._id}`, token);

    // save user, this will also hash the password
    await newCustomer.save();

    // generate otp and send it to the user
    const otp = generateOTP(4);
    await redis.setex(
      `emailVerificationOTP:${email}`,
      OTP_EXPIRES_IN_FROM_NOW,
      otp,
    );
    // Not using await here because we don't want to wait for email to be sent
    // we would not interrupt the sign up process for verification
    // verification is optional & can be done later also
    // without verification sure user won't be allowed to do some actions
    transport
      .sendMail({
        from: `EatEasers <${config.email.gmail_id}>`,
        to: email,
        subject: "Email verification OTP",
        html: EMAIL_VERIFICATION_OTP_TEMPLATE(otp, name!),
      })
      .catch((err: any) => {
        console.log(
          "[ERROR]",
          err.message,
          "Error in sending email verification otp.",
        );
      });

    sendResponse(res, {
      token,
      data: newCustomer,
      message: "Sign up successful",
      statusCode: httpStatus.CREATED,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

export const authController = { handleSignUp };
