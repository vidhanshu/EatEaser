import { Response } from "express";
import httpStatus from "http-status";
import { FilterQuery } from "mongoose";
import { NSCommon, NSAuth, NSRestaurant } from "../../../types";
import {
  ResponseError,
  sendErrorResponse,
  sendResponse,
} from "../../../utils/response";
import { Category } from "../../../models";

const handleGetCategoryById = (role: NSAuth.ROLES) => {
  return async (
    req: NSCommon.TypedRequest<NSRestaurant.IMenuItem> & NSCommon.IAuthRequest,
    res: Response
  ) => {
    try {
      const { id } = req.params;
      // check if category exists
      const category = await Category.findById(id);
      if (!category) {
        throw new ResponseError("Category not found", httpStatus.NOT_FOUND);
      }
      await category.populate("restaurant");
      sendResponse(res, {
        data: category,
        statusCode: 200,
      });
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };
};

const handleListCategories = (role: NSAuth.ROLES) => {
  return async (
    req: NSCommon.TypedRequest<null, NSCommon.IListDataPayload> &
      NSCommon.IAuthRequest,
    res: Response
  ) => {
    const { q } = req.query;
    try {
      const filter: FilterQuery<NSRestaurant.ICategory> = {};
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
      const resultCount = await Category.countDocuments(filter);
      const totalPages = Math.ceil(resultCount / resultPerPage);
      const result = await Category.find(filter, {}, { limit, skip });

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

export const commonCategoryController = {
  handleGetCategoryById,
  handleListCategories,
};
