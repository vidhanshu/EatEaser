import { Request, Response } from "express";
import {
  IListOrderSchema,
  IUpdateOrderSchema,
} from "../../../utils/validations";
import { NSCommon, NSRestaurant } from "../../../types";
import { Order } from "../../../models";
import { sendErrorResponse, sendResponse } from "../../../utils/response";
import { FilterQuery } from "mongoose";

const handleListOrder = async (
  req: NSCommon.TypedRequest<null, IListOrderSchema> & NSCommon.IAuthRequest,
  res: Response
) => {
  const { restaurantId } = req;
  const { startTime, endTime, status } = req.query;
  try {
    const filter: FilterQuery<IListOrderSchema> = {
      restaurant: restaurantId,
    };
    if (startTime || endTime) {
      filter.createdAt = {};
      if (startTime) filter.createdAt.$gte = new Date(startTime as any);
      if (endTime) filter.createdAt.$lte = new Date(endTime as any);
    }
    if (status) filter.status = status;
    const { resultPerPage = 10, page = 1 } = req.query;
    const limit = resultPerPage;
    const skip = resultPerPage * (page - 1);
    const resultCount = await Order.countDocuments(filter);
    const totalPages = Math.ceil(resultCount / resultPerPage);
    const result = await Order.find(filter, {}, { limit, skip });

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

const handleUpdateOrder = async (
  req: NSCommon.TypedRequest<IUpdateOrderSchema>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { items, status, paymentMethod, paymentStatus, transactionId } =
      req.body;
    const order = await Order.findById(id);
    if (!order) {
      throw new Error("Order not found");
    }
    if (items) {
      order.items = items as NSRestaurant.IOrder["items"];
    }
    if (status) {
      order.status = status;
    }
    if (paymentMethod) {
      order.payment.method = paymentMethod;
    }
    if (paymentStatus) {
      order.payment.status = paymentStatus;
    }
    if (transactionId) {
      order.payment.transactionId = transactionId;
    }

    await order.save();
    sendResponse(res, {
      message: "Order updated successfully",
      data: order,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

export const adminOrderController = {
  handleListOrder,
  handleUpdateOrder,
};
