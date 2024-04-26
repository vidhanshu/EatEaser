import { Schema, model } from "mongoose";
import { NSRestaurant } from "../types";

const TableSchema = new Schema<NSRestaurant.ITable>(
  {
    capacity: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["AVAILABLE", "RESERVED", "OCCUPIED"],
      default: "AVAILABLE",
    },
    name: {
      type: String,
      required: true,
      maxLength: 100,
      trim: true,
    },
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    // this will be a s3 uploaded qr code link
    qrCode: {
      type: String,
    },
    // This field may include a description of the table, such as its location in the restaurant.
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

TableSchema.index({ name: 1, restaurant: 1 }, { unique: true });

export const Table = model("Table", TableSchema);
