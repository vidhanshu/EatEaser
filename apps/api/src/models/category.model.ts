import { Schema, model } from "mongoose";
import { NSRestaurant } from "../types";

const CategorySchema = new Schema<NSRestaurant.ICategory>(
  {
    name: {
      type: String,
      required: true,
      maxLength: 100,
      index: true,
    },
    description: {
      type: String,
      maxLength: 1000,
    },
    image: {
      type: String,
    },
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// Compound unique index on 'name' and 'restaurant'
CategorySchema.index({ name: 1, restaurant: 1 }, { unique: true });

export const Category = model("Category", CategorySchema);
