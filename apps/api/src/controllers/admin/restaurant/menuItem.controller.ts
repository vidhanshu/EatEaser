import { Types } from "mongoose";
import { Response } from "express";
import httpStatus from "http-status";
import { NSCommon, NSRestaurant } from "../../../types";
import {
  ResponseError,
  sendErrorResponse,
  sendResponse,
} from "../../../utils/response";
import { Category, MenuItem, Restaurant } from "../../../models";

const handleCreateItem = async (
  req: NSCommon.TypedRequest<NSRestaurant.IMenuItem> & NSCommon.IAuthRequest,
  res: Response
) => {
  try {
    const { restaurantId } = req;
    // check if the restaurant exists
    const restaurantExists = await Restaurant.findById(restaurantId, {
      _id: 1,
    });
    if (!restaurantExists) {
      throw new ResponseError("Restaurant not found", httpStatus.NOT_FOUND);
    }
    // check if category exists
    const categoryExists = await Category.findById(req.body.category, {
      _id: 1,
    });
    if (!categoryExists) {
      throw new ResponseError("Category not found", httpStatus.NOT_FOUND);
    }
    // create menu item
    const menuItem = new MenuItem({
      ...req.body,
      restaurant: restaurantId,
    });
    await menuItem.save();

    sendResponse(res, {
      message: "Menu item created successfully",
      data: menuItem,
      statusCode: 201,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const handleDeleteItemById = async (
  req: NSCommon.TypedRequest<NSRestaurant.IMenuItem> & NSCommon.IAuthRequest,
  res: Response
) => {
  try {
    const {
      restaurantId,
      params: { id },
    } = req;
    // check if the restaurant exists
    const restaurantExists = await Restaurant.findById(restaurantId, {
      _id: 1,
    });
    if (!restaurantExists) {
      throw new ResponseError("Restaurant not found", httpStatus.NOT_FOUND);
    }
    // check if menu item exists
    const menuItemExists = await MenuItem.findById(id, { _id: 1 });
    if (!menuItemExists) {
      throw new ResponseError("Menu item not found", httpStatus.NOT_FOUND);
    }
    // delete menu item
    await MenuItem.deleteOne({ _id: id });

    sendResponse(res, {
      message: "Menu item deleted successfully",
      statusCode: 200,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const handleUpdateItemById = async (
  req: NSCommon.TypedRequest<NSRestaurant.IMenuItem> & NSCommon.IAuthRequest,
  res: Response
) => {
  try {
    const {
      restaurantId,
      params: { id },
    } = req;
    // check if the restaurant exists
    const restaurantExists = await Restaurant.findById(restaurantId, {
      _id: 1,
    });
    if (!restaurantExists) {
      throw new ResponseError("Restaurant not found", httpStatus.NOT_FOUND);
    }
    // update menu item
    const updatedMenu = await MenuItem.findOneAndUpdate(
      { _id: id, restaurant: restaurantId },
      req.body,
      { new: true }
    );
    if (!updatedMenu)
      throw new ResponseError("Menu item not found", httpStatus.NOT_FOUND);

    sendResponse(res, {
      message: "Menu item updated successfully",
      data: updatedMenu,
      statusCode: 200,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

export const adminMenuItemController = {
  handleCreateItem,
  handleDeleteItemById,
  handleUpdateItemById,
};
