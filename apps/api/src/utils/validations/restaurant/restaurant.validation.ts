import Joi from "joi";
import { NSRestaurant } from "../../../types";
import { DAYS, MOBILE_REGEX } from "../../constants";

const createRestaurantSchema = {
  body: Joi.object<NSRestaurant.ICreateRestaurantPayload>().keys({
    email: Joi.string().email().required(),
    name: Joi.string().min(3).max(50).required(),
    acceptsReservations: Joi.boolean().optional(),
    address: Joi.string().min(5).max(500).required(),
    phone: Joi.string().min(10).required().pattern(MOBILE_REGEX),
    description: Joi.string().min(10).max(1000).optional(),
    googleMapLink: Joi.string().optional(),
    openingHours: Joi.array().items({
      day: Joi.string()
        .valid(...DAYS)
        .required(), // format-> Mo, Tu, We, Th, Fr, Sa, Su
      opening: Joi.string().max(5).required(), // format-> 00:00 or NA
      closing: Joi.string().max(5).required(), // format-> 00:00 or NA
    }),
    image: Joi.string().uri().optional(),
    website: Joi.string().uri().optional(),
  }),
};

const updateRestaurantSchema = {
  body: Joi.object<NSRestaurant.ICreateRestaurantPayload>()
    .keys({
      email: Joi.string().email(),
      name: Joi.string().min(3).max(50),
      acceptsReservations: Joi.boolean(),
      address: Joi.string().min(5).max(500),
      phone: Joi.string().min(10).pattern(MOBILE_REGEX),
      description: Joi.string().min(10).max(1000),
      googleMapLink: Joi.string(),
      openingHours: Joi.array()
        .items({
          day: Joi.string().valid(...DAYS), // format-> Mo, Tu, We, Th, Fr, Sa, Su
          opening: Joi.string().max(5), // format-> 00:00
          closing: Joi.string().max(5), // format-> 00:00
        })
        .max(7)
        .unique((a, b) => a.day === b.day),
      image: Joi.string().uri(),
      website: Joi.string().uri(),
    })
    .min(1),
};

export const restaurantValidation = {
  createRestaurantSchema,
  updateRestaurantSchema,
};
