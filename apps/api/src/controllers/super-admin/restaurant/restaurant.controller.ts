import { Response } from "express";
import {
  ResponseError,
  sendErrorResponse,
  sendResponse,
} from "../../../utils/response";
import { NSCommon, NSRestaurant } from "../../../types";
import { Restaurant } from "../../../models/restaurant.model";
import httpStatus from "http-status";

const handleCreateRestaurant = async (
  req: NSCommon.TypedRequest<NSRestaurant.ICreateRestaurantPayload>,
  res: Response
) => {
  try {
    const { address, email, name, phone } = req.body;
    // check if restaurant already exists
    const existingRestaurant = await Restaurant.findOne(
      { $or: [{ email }, { phone }] },
      { _id: 1 }
    );
    if (existingRestaurant) {
      throw new ResponseError("Restaurant already exists", httpStatus.CONFLICT);
    }
    const restaurant = new Restaurant({
      address,
      email,
      name,
      phone,
    });
    await restaurant.save();
    // TODO: send mail to the restaurant
    sendResponse(res, {
      message: "Created successfully",
      data: restaurant,
      statusCode: httpStatus.CREATED,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const handleListRestaurant = async (
  req: NSCommon.TypedRequest<null, NSCommon.IListDataPayload>,
  res: Response
) => {
  try {
    const { resultPerPage = 10, page = 1 } = req.query;
    const limit = resultPerPage;
    const skip = resultPerPage * (page - 1);
    const resultCount = await Restaurant.countDocuments();
    const totalPages = Math.ceil(resultCount / resultPerPage);
    const result = await Restaurant.find({}, {}, { limit, skip });
    sendResponse(res, {
      data: {
        result,
        page,
        totalPages,
      },
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

export const superAdminRestaurantController = {
  handleCreateRestaurant,
  handleListRestaurant,
};
