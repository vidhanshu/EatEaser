import { Response } from "express";
import httpStatus from "http-status";
import { NSCommon, NSRestaurant } from "../../../types";
import {
  ResponseError,
  sendErrorResponse,
  sendResponse,
} from "../../../utils/response";
import { Restaurant, Table } from "../../../models";
import { deleteQR, generateAndUploadQR } from "../../../utils/helpers/qr";
import { getClientDomain } from "../../../utils/helpers";

const handleCreateTable = async (
  req: NSCommon.TypedRequest<NSRestaurant.ITable> & NSCommon.IAuthRequest,
  res: Response
) => {
  try {
    const { restaurantId } = req;
    // check if the restaurant exists
    const restaurantExists = await Restaurant.findById(restaurantId, {
      _id: 1,
    });
    if (!restaurantExists) {
      throw new ResponseError("Restaurant not found", httpStatus.NOT_FOUND);
    }
    const tableExists = await Table.findOne(
      {
        name: req.body.name,
        restaurant: restaurantId,
      },
      { _id: 1 }
    );
    if (tableExists) {
      throw new ResponseError("Table with the name already exists", httpStatus.CONFLICT);
    }
    // generate qr code for table
    const table = new Table({ ...req.body, restaurant: restaurantId });
    const url = await generateAndUploadQR(
      `${getClientDomain(req)}?tableId=${
        table._id
      }&restaurantId=${restaurantId}`,
      `${restaurantId}-${table._id}.png`
    );
    table.qrCode = url;
    await table.save();
    sendResponse(res, {
      message: "Table created successfully",
      data: table,
      statusCode: 201,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const handleDeleteTableById = async (
  req: NSCommon.IAuthRequest,
  res: Response
) => {
  try {
    const {
      restaurantId,
      params: { id },
    } = req;
    // check if the restaurant exists
    const restaurantExists = await Restaurant.findById(restaurantId, {
      _id: 1,
    });
    if (!restaurantExists) {
      throw new ResponseError("Restaurant not found", httpStatus.NOT_FOUND);
    }
    // delete table
    if (
      !(await Table.deleteOne({ _id: id, restaurant: restaurantId }).exec())
        .deletedCount
    ) {
      throw new ResponseError("Table not found", httpStatus.NOT_FOUND);
    }

    await deleteQR(`${restaurantId}-${id}.png`);
    sendResponse(res, {
      message: "Table deleted successfully",
      statusCode: 200,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const handleUpdateTableById = async (
  req: NSCommon.TypedRequest<NSRestaurant.ITable> & NSCommon.IAuthRequest,
  res: Response
) => {
  try {
    const {
      restaurantId,
      params: { id },
    } = req;
    // check if the restaurant exists
    const restaurantExists = await Restaurant.findById(restaurantId, {
      _id: 1,
    });
    if (!restaurantExists) {
      throw new ResponseError("Restaurant not found", httpStatus.NOT_FOUND);
    }

    // Update table
    const updatedTable = await Table.findOneAndUpdate(
      { _id: id, restaurant: restaurantId },
      { ...req.body },
      { new: true }
    );
    if (!updatedTable) {
      throw new ResponseError("Table not found", httpStatus.NOT_FOUND);
    }

    sendResponse(res, {
      message: "Table updated successfully",
      data: updatedTable,
      statusCode: 200,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

export const adminTableController = {
  handleCreateTable,
  handleDeleteTableById,
  handleUpdateTableById,
};
