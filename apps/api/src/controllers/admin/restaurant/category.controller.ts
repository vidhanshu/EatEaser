import { Response } from "express";
import httpStatus from "http-status";
import { NSCommon, NSRestaurant } from "../../../types";
import {
  ResponseError,
  sendErrorResponse,
  sendResponse,
} from "../../../utils/response";
import { Category, MenuItem, Restaurant } from "../../../models";
import { deleteImage } from "../../../utils/helpers";

const handleCreateCategory = async (
  req: NSCommon.TypedRequest<NSRestaurant.ICategory> & NSCommon.IAuthRequest,
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
    const category = new Category({ ...req.body, restaurant: restaurantId });
    await category.save();
    sendResponse(res, {
      message: "Category created successfully",
      data: category,
      statusCode: 201,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const handleDeleteCategoryById = async (
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
    // delete cateogyr
    const deletedCat = await Category.findOneAndDelete({
      _id: id,
      restaurant: restaurantId,
    });
    if (!deletedCat) {
      throw new ResponseError("Category not found", httpStatus.NOT_FOUND);
    }
    // delete all menu items
    await MenuItem.deleteMany({
      category: id,
      restaurant: restaurantId,
    }).exec();
    // delete category image if exists
    if (deletedCat.image) {
      await deleteImage(deletedCat.image);
    }
    sendResponse(res, {
      message: "Category deleted successfully",
      statusCode: 200,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const handleUpdateCategoryById = async (
  req: NSCommon.TypedRequest<NSRestaurant.ICategory> & NSCommon.IAuthRequest,
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

    // if the category has image & image is being updated, delete the previous image
    const category = await Category.findById(id, { image: 1 });
    if (!category) {
      throw new ResponseError("Category not found", httpStatus.NOT_FOUND);
    }
    if (req.body.image && category.image) {
      await deleteImage(category.image);
    }

    // update category
    const updatedCategory = await Category.findOneAndUpdate(
      { _id: id, restaurant: restaurantId },
      req.body,
      { new: true }
    );
    if (!updatedCategory) {
      throw new ResponseError("Category not found", httpStatus.NOT_FOUND);
    }

    sendResponse(res, {
      message: "Category updated successfully",
      data: updatedCategory,
      statusCode: 200,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

export const adminCategoryController = {
  handleCreateCategory,
  handleDeleteCategoryById,
  handleUpdateCategoryById,
};
