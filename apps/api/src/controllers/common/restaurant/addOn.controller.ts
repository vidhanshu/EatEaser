import { Response } from "express";
import httpStatus from "http-status";
import { FilterQuery } from "mongoose";
import { NSCommon, NSAuth, NSRestaurant } from "../../../types";
import {
  ResponseError,
  sendErrorResponse,
  sendResponse,
} from "../../../utils/response";
import { AddOn } from "../../../models";

const handleGetAddOnById = (role: NSAuth.ROLES) => {
  return async (
    req: NSCommon.TypedRequest<NSRestaurant.IAddon> & NSCommon.IAuthRequest,
    res: Response
  ) => {
    try {
      const { id } = req.params;
      // check if add-on exists
      const addOn = await AddOn.findById(id);
      if (!addOn) {
        throw new ResponseError("Add-on not found", httpStatus.NOT_FOUND);
      }
      await addOn.populate("restaurant");
      sendResponse(res, {
        data: addOn,
        statusCode: 200,
      });
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };
};

const handleListAddOn = (role: NSAuth.ROLES) => {
  return async (
    req: NSCommon.TypedRequest<null, NSCommon.IListDataPayload> &
      NSCommon.IAuthRequest,
    res: Response
  ) => {
    const { q } = req.query;
    try {
      const filter: FilterQuery<NSRestaurant.IAddon> = {};
      if (role === "admin") {
        filter["restaurant"] = req.restaurantId;
      } else {
        filter["restaurant"] = req.params.restaurantId;
      }
      if (q) {
        filter["$or"] = [
          { name: { $regex: new RegExp(q as string, "i") } },
          { description: { $regex: new RegExp(q as string, "i") } },
        ];
      }
      const { resultPerPage = 10, page = 1 } = req.query;
      const limit = resultPerPage;
      const skip = resultPerPage * (page - 1);
      const resultCount = await AddOn.countDocuments(filter);
      const totalPages = Math.ceil(resultCount / resultPerPage);
      const result = await AddOn.find(filter, {}, { limit, skip });

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

export const commonAddOnController = {
  handleGetAddOnById,
  handleListAddOn,
};
