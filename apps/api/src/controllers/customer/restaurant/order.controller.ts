import { Response } from "express";
import { NSCommon, NSRestaurant } from "../../../types";
import {
  ResponseError,
  sendErrorResponse,
  sendResponse,
} from "../../../utils/response";
import { AddOn, MenuItem, Order, Restaurant, Table } from "../../../models";
import { FilterQuery } from "mongoose";
import httpStatus from "http-status";
import { razorPay } from "../../../configs/rzrpay";

const handleCreateOrder = async (req: NSCommon.IAuthRequest, res: Response) => {
  const { _id } = req;
  const { restaurantId, tableId } = req.query;
  const { items, paymentMethod } = req.body as {
    items: { item: string; quantity: number; addons: string[] }[];
    paymentMethod: any;
  };
  try {
    const restaurantExists = await Restaurant.findById(restaurantId, { id: 1 });
    if (!restaurantExists) {
      throw new ResponseError("Restaurant not found", 404);
    }
    const tableExists = await Table.findOne(
      { _id: tableId, restaurant: restaurantId },
      { id: 1, status: 1 }
    );
    if (!tableExists) {
      throw new ResponseError("Table not found", 404);
    }
    if (tableExists.status !== "AVAILABLE") {
      throw new ResponseError("Table not available", 400);
    }

    // calculate total
    const itemIds = items.map((item) => item.item);
    const itemIdToQtyMap = items.reduce(
      (acc, item) => {
        acc[item.item] = item.quantity;
        return acc;
      },
      {} as Record<string, number>
    );
    const addOnIds = items.map((item) => item.addons).flat();
    const menuItems = await MenuItem.find(
      { _id: { $in: itemIds } },
      { price: 1, isAvailable: 1 }
    );
    if (menuItems?.length === 0 || menuItems.length !== items.length) {
      throw new ResponseError("Invalid item(s)", 400);
    }
    // check if all items are available
    if (menuItems.some((item) => !item.isAvailable)) {
      throw new ResponseError("One or more items are not available", 400);
    }
    const addOns = await AddOn.find(
      { _id: { $in: addOnIds } },
      { price: 1, isAvailable: true }
    );
    if (addOns.length !== addOnIds.length) {
      throw new ResponseError("Invalid addOn(s)", 400);
    }
    let total = 0;
    menuItems.forEach(({ price, _id }) => {
      total += price * itemIdToQtyMap[_id.toString()];
    });
    addOns.forEach(({ price }) => {
      total += price;
    });

    // create order
    const order = new Order({
      customer: _id,
      restaurant: restaurantId,
      table: tableId,
      items,
      total,
      patment: { method: paymentMethod },
    });

    // create rzrpay order
    // const rzrpayOrder = await razorPay.orders.create({
    //   amount: total * 100,
    //   currency: "INR",
    //   receipt: order._id.toString(),
    //   method: paymentMethod.toLowerCase(),
    // });
    // if (!rzrpayOrder) {
    //   throw new ResponseError("Failed to create order", 500);
    // }
    await order.save();
    sendResponse(res, {
      data: {
        order,
        // rzrpayOrder,
      },
      message: "Order created successfully",
      statusCode: httpStatus.CREATED,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const handleUpdateOrder = async (
  req: NSCommon.TypedRequest<
    Pick<NSRestaurant.IOrder, "items"> & {
      paymentMethod: Pick<NSRestaurant.IOrder["payment"], "method">;
    }
  >,
  res: Response
) => {
  try {
    const { items, paymentMethod } = req.body;
    const data: any = {};
    if (items) {
      data["items"] = items;
    }
    if (paymentMethod) {
      data.payment = { method: paymentMethod };
    }
    const { id } = req.params;
    const filter: FilterQuery<NSRestaurant.IOrder> = { _id: id };
    // check if order is confirmed, if yes, then do not allow to update
    const orderExists = await Order.findById(id, { status: 1 });
    if (!orderExists) {
      throw new ResponseError("Order not found", 404);
    }
    if (orderExists.status !== "PENDING") {
      throw new ResponseError(
        `Order is already ${orderExists.status.toLowerCase()}`,
        400
      );
    }

    // re-calculating total
    let total = 0;
    const itemIds = items?.map((item) => item.item);
    const menuItems = await MenuItem.find(
      { _id: { $in: itemIds } },
      { price: 1, isAvailable: 1 }
    );
    // check if all items are available
    if (menuItems.some((item) => !item.isAvailable)) {
      throw new ResponseError("One or more items are not available", 400);
    }
    menuItems.forEach(({ price }) => {
      total += price;
    });
    data.total = total;

    const order = await Order.findOneAndUpdate(filter, data, { new: true });
    sendResponse(res, {
      data: order,
      message: "Order updated successfully",
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const handleCancelOrder = async (req: NSCommon.IAuthRequest, res: Response) => {
  const { id } = req.params;
  const { _id } = req;
  try {
    const filter: FilterQuery<NSRestaurant.IOrder> = { _id: id, customer: _id };

    // check if order, is not pending any more
    const orderExists = await Order.findById(id, { status: 1 });
    if (!orderExists) {
      throw new ResponseError("Order not found", 404);
    }
    if (orderExists.status !== "PENDING") {
      throw new ResponseError(
        `Order is already ${orderExists.status.toLowerCase()}, it can't be cancelled.`,
        400
      );
    }
    const order = await Order.findOneAndUpdate(
      filter,
      { status: "CANCELLED" },
      { new: true }
    );
    sendResponse(res, {
      data: order,
      message: "Order cancelled successfully",
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const listOrders = async (
  req: NSCommon.TypedRequest<null, NSCommon.IListDataPayload> &
    NSCommon.IAuthRequest,
  res: Response
) => {
  const { _id } = req;
  try {
    const filter: Record<string, any> = { customer: _id };
    const {
      resultPerPage = 10,
      page = 1,
      startTime,
      endTime,
      status,
    } = req.query;
    if (startTime) {
      filter.createdAt = { $gte: new Date(startTime as string) };
    }
    if (endTime) {
      filter.createdAt = { $lte: new Date(endTime as string) };
    }
    if (status) {
      filter.status = status;
    }

    const limit = resultPerPage;
    const skip = resultPerPage * (page - 1);
    const resultCount = await Order.countDocuments(filter);
    const totalPages = Math.ceil(resultCount / resultPerPage);
    const result = await Order.find(filter, {}, { limit, skip }).populate(
      "items.item",
      { image: 1, name: 1 }
    );

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

export const customerOrderController = {
  handleCreateOrder,
  listOrders,
  handleUpdateOrder,
  handleCancelOrder,
};
