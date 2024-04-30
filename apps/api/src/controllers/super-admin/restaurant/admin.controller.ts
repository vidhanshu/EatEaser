import { Request, Response } from "express";
import { NSAdmin, NSCommon } from "../../../types";
import { User } from "../../../models";
import {
  ResponseError,
  sendErrorResponse,
  sendResponse,
} from "../../../utils/response";
import { generateToken } from "../../../utils/helpers";
import { redis } from "../../../configs";
import httpStatus from "http-status";
import { transport } from "../../../configs";
import { config } from "../../../configs";
import { ADMIN_SUCCESSFUL_SIGNUP_TEMPLATE } from "../../../utils/templates";
import { Restaurant } from "../../../models/restaurant.model";
import { getClientDomain } from "../../../utils/helpers";

const handleCreateAdmin = async (
  req: NSCommon.TypedRequest<NSAdmin.IAdminCreatePayload>,
  res: Response
) => {
  /**
   * TODO:
   * In future, planning to make this like sending the email invite to the admin
   * ?token=<token>&restaurantId=<restaurant_id> may be, restaurantId wouldn't be secure ig
   */
  const { email, name, password, phone } = req.body;
  const { restaurantId } = req.params;

  try {
    const admin = await User.findOne(
      { $or: [{ email }, { phone }] },
      { _id: 1 }
    );
    if (admin) {
      throw new ResponseError(
        "User already exists with this email or phone number.",
        httpStatus.CONFLICT
      );
    }
    const restaurantExists = await Restaurant.findById(restaurantId, {
      name: 1,
      _id: 1,
    });
    if (!restaurantExists) {
      throw new ResponseError(
        "Restaurant not found with this id",
        httpStatus.NOT_FOUND
      );
    }
    const adminWithRestaurantExists = await User.findOne(
      {
        role: "admin",
        restaurant: restaurantId,
      },
      { id: true }
    );
    if (adminWithRestaurantExists) {
      throw new ResponseError(
        "Admin already exists for this restaurant",
        httpStatus.CONFLICT
      );
    }
    const newAdmin = new User({
      name,
      email,
      phone,
      password,
      restaurant: restaurantId,
      role: "admin",
    });
    const token = generateToken({ _id: newAdmin._id.toString() });
    await redis.lpush(`accessTokens:${newAdmin._id}`, token);

    // save user, this will also hash the password
    await newAdmin.save();

    transport.sendMail({
      from: `EatEasers <${config.email.gmail_id}>`,
      to: email,
      subject: "Registered as an Admin successfully",
      html: ADMIN_SUCCESSFUL_SIGNUP_TEMPLATE(
        name!,
        restaurantExists.name,
        getClientDomain(req as Request)
      ),
    });
    sendResponse(res, {
      token,
      data: newAdmin,
      message: "Admin Sign up successful",
      statusCode: httpStatus.CREATED,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

export const superAdminAdminController = { handleCreateAdmin };
