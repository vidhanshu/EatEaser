import { model, Schema } from "mongoose";
import { NSRestaurant } from "../types";

const orderSchema = new Schema<NSRestaurant.IOrder>(
  {
    customer: { type: Schema.Types.ObjectId, ref: "User" },
    restaurant: { type: Schema.Types.ObjectId, ref: "Restaurant" },
    table: { type: Schema.Types.ObjectId, ref: "Table" },
    items: [
      {
        item: { type: Schema.Types.ObjectId, ref: "MenuItem" },
        quantity: Number,
        addons: [{ type: Schema.Types.ObjectId, ref: "AddOn" }],
      },
    ],
    payment: {
      method: {
        type: String,
        enum: ["CASH", "CARD", "NETBANKING", "UPI"],
        default: "CASH",
      },
      status: {
        type: String,
        enum: ["PENDING", "COMPLETED", "FAILED"],
        default: "PENDING",
      },
      transactionId: String,
    },
    total: Number,
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export const Order = model("Order", orderSchema);
