/**
 * This file contains, every type related to authentication
 */
export namespace NSAuth {
  export interface IUser {
    name: string;
    email: string;
    password: string;
    phone: string;
    image?: string;
    role: string;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    restaurant?: string;
  }
  export interface IUserSignupPayload {
    email: string;
    password: string;
    name: string;
    phone: string;
  }
  export interface IUserSigninPayload {
    email: string;
    password: string;
  }

  export interface IVerifyEmailOTPPayload {
    otp: string;
    email: string;
  }

  export interface IGenerateEmailOTPPayload {
    email: string;
  }

  export type IForgotPasswordPayload = IGenerateEmailOTPPayload;

  export type IResetTokenPayload = {
    reset_token: string;
    password: string;
  };

  export type ROLES =
    | "customer"
    | "admin"
    | "staff"
    | "kitchen"
    | "super-admin";
}
