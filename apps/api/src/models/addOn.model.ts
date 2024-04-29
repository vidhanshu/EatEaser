import { Schema, model } from "mongoose";
import { NSRestaurant } from "../types";

const AddOnSchema = new Schema<NSRestaurant.IAddon>(
  {
    name: { type: String, required: true, maxlength: 100, trim: true },
    image: { type: String },
    isAvailable: { type: Boolean, default: true },
    description: { type: String, maxlength: 1000 },
    price: { type: Number, required: true },
    restaurant: { type: Schema.Types.ObjectId, ref: "Restaurant" },
  },
  { timestamps: true }
);

AddOnSchema.index({ name: 1, restaurant: 1 }, { unique: true });

export const AddOn = model<NSRestaurant.IAddon>("AddOn", AddOnSchema);
