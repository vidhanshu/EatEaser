import { Response } from "express";
import httpStatus from "http-status";
import { NSCommon, NSRestaurant } from "../../../types";
import {
  ResponseError,
  sendErrorResponse,
  sendResponse,
} from "../../../utils/response";
import { MenuItem, Restaurant, AddOn } from "../../../models";

const handleCreateAddOn = async (
  req: NSCommon.TypedRequest<NSRestaurant.IAddon> & NSCommon.IAuthRequest,
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
    const addOn = new AddOn({ ...req.body, restaurant: restaurantId });
    await addOn.save();
    sendResponse(res, {
      message: "Add-on created successfully",
      data: addOn,
      statusCode: 201,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const handleDeleteAddOnById = async (
  req: NSCommon.IAuthRequest,
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
    // delete add-on
    if (
      !(await AddOn.deleteOne({ _id: id, restaurant: restaurantId }).exec())
        .deletedCount
    ) {
      throw new ResponseError("Add-on not found", httpStatus.NOT_FOUND);
    }
    // remove add-on from all menu items
    await MenuItem.updateMany(
      { "addOns.addOn": id },
      { $pull: { addOns: { addOn: id } } }
    );

    sendResponse(res, {
      message: "Add-on deleted successfully",
      statusCode: 200,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const handleUpdateAddOnById = async (
  req: NSCommon.TypedRequest<NSRestaurant.IAddon> & NSCommon.IAuthRequest,
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

    // update Add-on
    const updatedCategory = await AddOn.findOneAndUpdate(
      { _id: id, restaurant: restaurantId },
      req.body,
      { new: true }
    );
    if (!updatedCategory) {
      throw new ResponseError("Add-on not found", httpStatus.NOT_FOUND);
    }

    sendResponse(res, {
      message: "Add-on updated successfully",
      data: updatedCategory,
      statusCode: 200,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

export const adminAddOnController = {
  handleCreateAddOn,
  handleDeleteAddOnById,
  handleUpdateAddOnById,
};
