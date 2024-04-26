import { Response } from "express";
import httpStatus from "http-status";
import { FilterQuery } from "mongoose";
import { NSCommon, NSAuth, NSRestaurant } from "../../../types";
import {
  ResponseError,
  sendErrorResponse,
  sendResponse,
} from "../../../utils/response";
import { Table } from "../../../models";

const handleGetTableById = (role: NSAuth.ROLES) => {
  return async (req: NSCommon.IAuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      // check if table exists
      const table = await Table.findById(id);
      if (!table) {
        throw new ResponseError("Table not found", httpStatus.NOT_FOUND);
      }
      await table.populate("restaurant", { _id: 1, name: 1 });
      sendResponse(res, {
        data: table,
        statusCode: 200,
      });
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };
};

const handelListTable = (role: NSAuth.ROLES) => {
  return async (
    req: NSCommon.TypedRequest<null, NSCommon.IListDataPayload> &
      NSCommon.IAuthRequest,
    res: Response,
  ) => {
    try {
      const filter: FilterQuery<NSRestaurant.ICategory> = {};
      if (role === "admin") {
        filter["restaurant"] = req.restaurantId;
      } else {
        filter["restaurant"] = req.params.restaurantId;
      }

      const { resultPerPage = 10, page = 1 } = req.query;
      const limit = resultPerPage;
      const skip = resultPerPage * (page - 1);
      const resultCount = await Table.countDocuments(filter);
      const totalPages = Math.ceil(resultCount / resultPerPage);
      const result = await Table.find(filter, {}, { limit, skip });

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

export const commonTableController = {
  handleGetTableById,
  handelListTable,
};
