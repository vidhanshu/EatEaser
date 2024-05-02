import { Response } from "express";
import { Order } from "../../../models";
import { NSAuth, NSCommon } from "../../../types";
import {
  ResponseError,
  sendErrorResponse,
  sendResponse,
} from "../../../utils/response";

const handleGetById =
  (role: NSAuth.ROLES) => async (req: NSCommon.IAuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const order = await Order.findById(id)
        .populate("restaurant", {
          _id: 1,
          name: 1,
        })
        .populate("table", { _id: 1, name: 1 })
        .populate("items.item", {
          _id: 1,
          name: 1,
          image: 1,
          price: 1,
        })
        .populate("items.addons", { _id: 1, name: 1, image: 1, price: 1 });
      if (!order) {
        throw new ResponseError("Order not found", 404);
      }
      sendResponse(res, { data: order });
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };

export const commonOrderController = {
  handleGetById,
};
