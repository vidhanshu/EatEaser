import { FilterQuery } from "mongoose";
import { Response } from "express";
import httpStatus from "http-status";
import { NSCommon, NSRestaurant, NSAuth } from "../../../types";
import {
  ResponseError,
  sendErrorResponse,
  sendResponse,
} from "../../../utils/response";
import { MenuItem } from "../../../models";

const handleGetItemById = (role: NSAuth.ROLES) => {
  return async (
    req: NSCommon.TypedRequest<NSRestaurant.IMenuItem> & NSCommon.IAuthRequest,
    res: Response
  ) => {
    try {
      const { id } = req.params;
      const filter: FilterQuery<NSRestaurant.IMenuItem> = { _id: id };
      if (role === "admin") {
        filter["restaurant"] = req.restaurantId;
      }
      // check if menu item exists
      const menuItemExists = await MenuItem.findOne(filter)
        .populate("restaurant", { _id: 1, name: 1 })
        .populate("category")
        .populate("addOns");
      if (!menuItemExists) {
        throw new ResponseError("Menu item not found", httpStatus.NOT_FOUND);
      }

      sendResponse(res, {
        data: menuItemExists,
        statusCode: 200,
      });
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };
};

const handleListItems = (role: NSAuth.ROLES) => {
  return async (
    req: NSCommon.TypedRequest<null, NSCommon.IListDataPayload> &
      NSCommon.IAuthRequest,
    res: Response
  ) => {
    try {
      const { id: restaurantId } = req.params;
      const {
        category,
        isAvailable,
        isVegan,
        isVegetarian,
        minPrice,
        maxPrice,
        q,
        sort,
      } = req.query;
      const sortQuery: { [key: string]: number } = {};
      if (sort) {
        const [key, order] = (sort as string).split(":");
        sortQuery[key] = order === "asc" ? 1 : -1;
      }
      const filter: FilterQuery<NSRestaurant.IMenuItem> = {
        restaurant: restaurantId,
      };
      if (role === "admin") {
        filter["restaurant"] = req.restaurantId;
      }
      if (category) {
        filter["category"] = category;
      }
      if (isAvailable) {
        filter["isAvailable"] = isAvailable;
      }
      if (isVegan) {
        filter["isVegan"] = isVegan;
      }
      if (isVegetarian) {
        filter["isVegetarian"] = isVegetarian;
      }
      if (minPrice) {
        filter["price"] = { $gte: minPrice };
      }
      if (maxPrice) {
        if (filter.price) {
          filter.price["$lte"] = maxPrice;
        }
      }
      if (q) {
        // filter if this q contains in name or description
        filter["$or"] = [
          { name: { $regex: new RegExp(q as string, "i") } },
          { description: { $regex: new RegExp(q as string, "i") } },
        ];
      }

      const { resultPerPage = 10, page = 1 } = req.query;
      const limit = resultPerPage;
      const skip = resultPerPage * (page - 1);
      const resultCount = await MenuItem.countDocuments(filter);
      const totalPages = Math.ceil(resultCount / resultPerPage);
      const result = await MenuItem.find(
        filter,
        {},
        { limit, skip, sort: sortQuery }
      )
        .populate("restaurant", { _id: 1, name: 1 })
        .populate("category", { _id: 1, name: 1 })
        .populate("addOns", { _id: 1, name: 1 });
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

export const commonMenuItemController = {
  handleGetItemById,
  handleListItems,
};
