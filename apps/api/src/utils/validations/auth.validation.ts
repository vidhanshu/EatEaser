import Joi from "joi";
import { NSAuth } from "../../types";
import { MOBILE_REGEX } from "../constants";

const SignUpSchema = {
  body: Joi.object<NSAuth.IUserSignupPayload>().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(30).required(),
    name: Joi.string().min(3).max(50).required(),
    phone: Joi.string().min(10).max(15).required().pattern(MOBILE_REGEX),
  }),
};

const SignInSchema = {
  body: Joi.object<NSAuth.IUserSigninPayload>().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(30).required(),
  }),
};

const VerifyEmailOTPSchema = {
  body: Joi.object<NSAuth.IVerifyEmailOTPPayload>().keys({
    otp: Joi.string().length(4).required(),
    email: Joi.string().email().required(),
  }),
};

const GenerateEmailOTPSchema = {
  body: Joi.object<NSAuth.IGenerateEmailOTPPayload>().keys({
    email: Joi.string().email().required(),
  }),
};

const ForgotPasswordSchema = GenerateEmailOTPSchema;

const ResetPasswordSchema = {
  query: Joi.object<NSAuth.IResetTokenPayload>().keys({
    reset_token: Joi.string().required(),
  }),
  body: Joi.object<NSAuth.IResetTokenPayload>().keys({
    password: Joi.string().min(8).max(30).required(),
  }),
};

export const authValidation = {
  SignUpSchema,
  SignInSchema,
  VerifyEmailOTPSchema,
  GenerateEmailOTPSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
};
