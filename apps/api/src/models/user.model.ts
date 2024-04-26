/**
 * User's with all roles will be saved in the User collection itself
 * ROLES: ["admin", "customer", "kitchen", "staff", "super-admin"]
 *
 * Super Admin : Can manage all the resources and other admin users
 * Admin: Can manage all the resources
 * Customer: Can only manage their own resources
 * Kitchen: Can manage only kitchen related resources
 * Staff: Can manage only staff related resources
 */
import { model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

import { MOBILE_REGEX, ROLES, SALT } from "../utils/constants";
import { NSAuth } from "../types";

const UserSchema = new Schema<NSAuth.IUser>(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 50,
      minlength: 3,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      maxlength: 350,
    },
    password: {
      type: String,
      required: true,
      // not giving maxlenght, because it gonna be hashed password
    },
    phone: {
      type: String,
      trim: true,
      match: MOBILE_REGEX,
      required: true,
      unqiue: true,
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      enum: ROLES,
      required: true,
      default: "customer",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
    },
  },
  {
    timestamps: true,
  },
);

// middlewares
UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    // hash password
    const hashedPassword = await bcrypt.hash(user.password, SALT);
    user.password = hashedPassword;
    next();
  }
});

UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

export const User = model<NSAuth.IUser>("User", UserSchema);
