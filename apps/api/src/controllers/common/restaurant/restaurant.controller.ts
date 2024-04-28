import { Response } from "express";
import { Restaurant } from "../../../models";
import { NSAuth, NSCommon, NSRestaurant } from "../../../types";
import {
  ResponseError,
  sendErrorResponse,
  sendResponse,
} from "../../../utils/response";
import httpStatus from "http-status";

const handleListRestaurant = (role: NSAuth.ROLES) => {
  return async (
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
};

const handleGetRestaurantById = (role: NSAuth.ROLES) => {
  return async (
    req: NSCommon.TypedRequest<NSRestaurant.IMenuItem> & NSCommon.IAuthRequest,
    res: Response
  ) => {
    try {
      const { id } = req.params;
      // check if restaurant exists
      const restaurant = await Restaurant.findById(id);
      if (!restaurant) {
        throw new ResponseError("restaurant not found", httpStatus.NOT_FOUND);
      }
      sendResponse(res, {
        data: restaurant,
        statusCode: 200,
      });
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };
};

export const commonRestaurantController = {
  handleListRestaurant,
  handleGetRestaurantById,
};
