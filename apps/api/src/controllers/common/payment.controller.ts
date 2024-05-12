import crypto from "crypto";
import { Response } from "express";
import { config } from "../../configs";
import { razorPay } from "../../configs/rzrpay";
import { Order } from "../../models";
import { NSCommon } from "../../types";
import { ResponseError, sendErrorResponse, sendResponse } from "../../utils/response";

const createRzpOrder = async (req: NSCommon.IAuthRequest, res: Response) => {
  const { amount, orderId } = req.body;
  try {
    // create rzrpay order
    const rzrpayOrder = await razorPay.orders.create({
      amount: Number(amount) * 100,
      currency: "INR",
      receipt: orderId,
    });
    if (!rzrpayOrder) {
      throw new ResponseError("Failed to create order", 500);
    }
    // add the rzpOrderId to the order as well
    await Order.updateOne({ _id: orderId }, { $set: { "payment.rzpOrderId": rzrpayOrder.id } });
    sendResponse(res, {
      message: "Order created successfully",
      data: { rzpOrderId: rzrpayOrder.id },
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const orderPaymentVerification = async (req: NSCommon.IAuthRequest, res: Response) => {
  try {
    const payload = req.body;
    const orderId = req.params.id;
    const { rzpOrderId, rzpPaymentId, rzpSignature } = payload;

    const body = rzpOrderId + "|" + rzpPaymentId;

    const expectedSignature = crypto.createHmac("sha256", config.rzrpay.RAZORPAY_KEY_SECRET).update(body.toString()).digest("hex");

    const isAuthentic = expectedSignature === rzpSignature;

    if (isAuthentic) {
      await Order.updateOne(
        { _id: orderId },
        {
          $set: {
            "payment.status": "COMPLETED",
            "payment.rzpOrderId": rzpOrderId,
            "payment.rzpPaymentId": rzpPaymentId,
            "payment.rzpSignature": rzpSignature,
          },
        },
      );

      sendResponse(res, {
        message: "Payment verified successfully",
        data: { rzpPaymentId, orderId },
      });
    } else {
      throw new ResponseError("Payment verification failed", 400);
    }
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

export const paymentController = {
  orderPaymentVerification,
  createRzpOrder,
};
