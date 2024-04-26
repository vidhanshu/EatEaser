import Joi from "joi";
import { NSRestaurant } from "../../../types";
import { commonValidation } from "../common.validation";

const createMenuItemSchema = {
  body: Joi.object<NSRestaurant.IMenuItem>().keys({
    name: Joi.string().required(),
    price: Joi.number().required(),
    image: Joi.string().optional().uri(), // Set image as optional and validate it as URI
    description: Joi.string().optional().max(1000), // Set description as optional
    isAvailable: Joi.boolean().default(true),
    isVegan: Joi.boolean().default(false),
    isVegetarian: Joi.boolean().default(false),
    moreInfo: Joi.array().items(
      Joi.object().keys({
        label: Joi.string().required(),
        value: Joi.string().required(),
      })
    ),
    // array of addOns id
    addOns: Joi.array().items(commonValidation.ObjectIdSchema),
    category: Joi.string().required(),
  }),
};

const listMenuItemsSchema = {
  query: Joi.object().keys({
    category: commonValidation.ObjectIdSchema,
    resultPerPage: Joi.number().integer().min(1).default(10).optional(),
    page: Joi.number().integer().min(1).default(1).optional(),
    isAvailable: Joi.boolean().optional(),
    isVegan: Joi.boolean().optional(),
    isVegetarian: Joi.boolean().optional(),
    minPrice: Joi.number().positive().optional(),
    maxPrice: Joi.number().positive().optional(),
    q: Joi.string().optional(), // search query
  }),
};

const updateMenuItemSchema = {
  body: Joi.object<NSRestaurant.IMenuItem>()
    .keys({
      name: Joi.string(),
      description: Joi.string(),
      price: Joi.number(),
      image: Joi.string().uri(),
      isAvailable: Joi.boolean(),
      isVegan: Joi.boolean(),
      isVegetarian: Joi.boolean(),
      addOns: Joi.array().items(commonValidation.ObjectIdSchema),
      moreInfo: Joi.array().items(
        Joi.object().keys({
          label: Joi.string().required(),
          value: Joi.string().required(),
        })
      ),
    })
    .min(1),
  ...commonValidation.idParamPayloadSchema,
};

export const menuItemValidation = {
  createMenuItemSchema,
  listMenuItemsSchema,
  updateMenuItemSchema,
};
