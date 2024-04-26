import { Response } from "express";
import httpStatus from "http-status";
import { NSCommon, NSRestaurant } from "../../../types";
import {
  ResponseError,
  sendErrorResponse,
  sendResponse,
} from "../../../utils/response";
import { Restaurant } from "../../../models/restaurant.model";

const handleUpdateRestaurant = async (
  req: NSCommon.IAuthRequest &
    NSCommon.TypedRequest<NSRestaurant.IUpdateRestaurantPayload>,
  res: Response,
) => {
  try {
    const { restaurantId } = req;
    const {
      address,
      name,
      email,
      phone,
      acceptsReservations,
      description,
      googleMapLink,
      openingHours,
      image,
      website,
    } = req.body as NSRestaurant.IUpdateRestaurantPayload;
    const updatedData: Partial<NSRestaurant.IUpdateRestaurantPayload> = {};
    if (address !== undefined) updatedData["address"] = address;
    if (name !== undefined) updatedData["name"] = name;

    if (email !== undefined || phone !== undefined) {
      const findRestroFilter = [];
      if (email !== undefined) findRestroFilter.push({ email });
      if (phone !== undefined) findRestroFilter.push({ phone });
      const exists = await Restaurant.findOne({ $or: findRestroFilter });
      if (exists) {
        throw new ResponseError(
          "Email or phone already exists",
          httpStatus.BAD_REQUEST,
        );
      }
      if (email !== undefined) updatedData["email"] = email;
      if (phone !== undefined) updatedData["phone"] = phone;
    }
    if (acceptsReservations !== undefined)
      updatedData["acceptsReservations"] = acceptsReservations;
    if (description !== undefined) updatedData["description"] = description;
    if (googleMapLink !== undefined)
      updatedData["googleMapLink"] = googleMapLink;
    if (image !== undefined) updatedData["image"] = image;
    if (website !== undefined) updatedData["website"] = website;
    if (openingHours !== undefined) updatedData["openingHours"] = openingHours;

    const updatedRestro = await Restaurant.findByIdAndUpdate(
      restaurantId,
      updatedData,
      { new: true },
    );

    sendResponse(res, {
      data: updatedRestro,
      message: "Restaurant updated successfully",
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const handleGetMyRestaurant = async (
  req: NSCommon.IAuthRequest,
  res: Response,
) => {
  try {
    const { restaurantId } = req;
    const restaurant = await Restaurant.findById(restaurantId);
    // This case should never happens, as we have already checked in auth middleware
    if (!restaurant) {
      throw new Error("Restaurant not found");
    }
    sendResponse(res, { data: restaurant });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

export const adminRestaurantController = {
  handleUpdateRestaurant,
  handleGetMyRestaurant,
};
