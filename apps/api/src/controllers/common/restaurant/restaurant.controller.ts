import { Response } from "express";
import { Restaurant, Table } from "../../../models";
import { NSAuth, NSCommon, NSRestaurant } from "../../../types";
import {
  ResponseError,
  sendErrorResponse,
  sendResponse,
} from "../../../utils/response";
import httpStatus from "http-status";

const handleListRestaurant = (role: NSAuth.ROLES) => {
  return async (
    req: NSCommon.TypedRequest<null, NSCommon.IListDataPayload> &
      NSCommon.IAuthRequest,
    res: Response
  ) => {
    try {
      const { resultPerPage = 10, page = 1, q } = req.query;
      const limit = resultPerPage;
      const skip = resultPerPage * (page - 1);
      const resultCount = await Restaurant.countDocuments();
      const totalPages = Math.ceil(resultCount / resultPerPage);
      const filters: Record<string, any> = {};
      if (q) {
        filters["$or"] = [
          { name: { $regex: new RegExp(q as string, "i") } },
          { description: { $regex: new RegExp(q as string, "i") } },
        ];
      }
      const result = await Restaurant.find(filters, {}, { limit, skip });
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
      const { includeTables } = req.query;
      // check if restaurant exists
      let responseData: Record<any, any> = {};
      const restaurant: any = await Restaurant.findById(id);
      if (!restaurant) {
        throw new ResponseError("restaurant not found", httpStatus.NOT_FOUND);
      }
      if (includeTables) {
        responseData = { ...restaurant.toJSON() };
        const tables = await Table.find({ restaurant: id });
        responseData.tables = tables;
      } else {
        responseData = restaurant;
      }
      sendResponse(res, {
        data: responseData,
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
