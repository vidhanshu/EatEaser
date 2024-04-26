import { model, Schema } from "mongoose";
import { NSRestaurant } from "../types";

const MenuItemSchema = new Schema<NSRestaurant.IMenuItem>(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 100,
      minlength: 3,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    image: { type: String },
    isAvailable: { type: Boolean, default: true },
    isVegan: { type: Boolean, default: false },
    isVegetarian: { type: Boolean, default: false },
    moreInfo: [
      {
        type: {
          label: { type: String, required: true },
          value: { type: String, required: true },
        },
      },
    ],
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
      index: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    price: { type: Number, required: true },

    addOns: [{ type: Schema.Types.ObjectId, ref: "AddOn" }],
    // TODO: more fields....
  },
  { timestamps: true }
);

export const MenuItem = model<NSRestaurant.IMenuItem>(
  "MenuItem",
  MenuItemSchema
);
