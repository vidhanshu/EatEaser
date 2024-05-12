import { model, Schema } from "mongoose";
import { NSRestaurant } from "../types";
import { DAYS } from "../utils/constants";

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
    ratingDetails: {
      type: {
        noOfReviews: { type: Number, default: 0 },
        rating: { type: Number, default: 0 },
        counts: [
          {
            stars: { type: Number, enum: [1, 2, 3, 4, 5] },
            count: { type: Number, default: 0 },
          },
        ],
      },
      default: {
        rating: 0,
        noOfReviews: 0,
        counts: [
          { stars: 1, count: 0 },
          { stars: 2, count: 0 },
          { stars: 3, count: 0 },
          { stars: 4, count: 0 },
          { stars: 5, count: 0 },
        ],
      },
    },
    googleMapLink: { type: String },
    website: { type: String },
    acceptsReservations: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Restaurant = model("Restaurant", RestaurantSchema);
