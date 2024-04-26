import { model, Schema } from "mongoose";
import { DAYS } from "../utils/constants";
import { NSRestaurant } from "../types";

const RestaurantSchema = new Schema<NSRestaurant.IResturant>(
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
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      maxlength: 350,
    },
    address: {
      type: String,
      trim: true,
      required: true,
      maxlength: 500,
    },
    phone: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    image: {
      type: String,
    },
    openingHours: {
      type: [
        {
          day: {
            type: String,
            enum: DAYS,
            required: true,
          },
          opening: {
            type: String,
            required: true,
          },
          closing: {
            type: String,
            required: true,
          },
        },
      ],
      maxlength: 7,
      required: true,
    },
    googleMapLink: { type: String },
    website: { type: String },
    acceptsReservations: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Restaurant = model("Restaurant", RestaurantSchema);
