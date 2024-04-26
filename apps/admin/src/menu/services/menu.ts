import { ROUTES } from "@src/common/utils/api-routes";
import axiosInstance from "@src/common/utils/axios";
import { NSRestaurant } from "@src/types/restaurant.type";
import { IMenuFilters } from "../hooks/use-menu";

export const menuService = {
  getMenuItems: async ({
    isAvailable,
    page,
    category,
    isVegan,
    isVegetarian,
    maxPrice,
    minPrice,
    q,
  }: IMenuFilters) => {
    const sp = new URLSearchParams();
    if (isAvailable !== undefined) sp.set("isAvailable", "true");
    if (page !== undefined) sp.set("page", page.toString());
    if (category !== undefined) sp.set("category", category);
    if (isVegan !== undefined) sp.set("isVegan", "true");
    if (isVegetarian !== undefined) sp.set("isVegetarian", "true");
    if (maxPrice !== undefined) sp.set("maxPrice", maxPrice.toString());
    if (minPrice !== undefined) sp.set("minPrice", minPrice.toString());
    if (q !== undefined  && q.trim() != "") sp.set("q", q);
    
    return ((
      await axiosInstance.get(
        `${ROUTES.restaurant.menuItem.list}?${sp.toString()}`
      )
    ).data.data ?? []) as NSCommon.IListRespone<NSRestaurant.IMenuItem>["data"];
  },
  updateMenuItem: async ({
    id,
    payload,
  }: {
    id: string;
    payload: Partial<NSRestaurant.IMenuItem>;
  }) =>
    (
      await axiosInstance.patch<NSCommon.ApiResponse<NSRestaurant.IMenuItem>>(
        ROUTES.restaurant.menuItem.update(id),
        payload
      )
    ).data,
  createMenuItem: async (payload: NSRestaurant.IMenuItem) =>
    (
      await axiosInstance.post<NSCommon.ApiResponse<NSRestaurant.IMenuItem>>(
        ROUTES.restaurant.menuItem.create,
        payload
      )
    ).data,
  deleteMenuItem: async ({ id }: { id: string }) =>
    (
      await axiosInstance.delete<NSCommon.ApiResponse<NSRestaurant.IMenuItem>>(
        ROUTES.restaurant.menuItem.delete(id)
      )
    ).data,
  getById: async (id: string) =>
    (
      await axiosInstance.get<NSCommon.ApiResponse<NSRestaurant.IMenuItem>>(
        ROUTES.restaurant.menuItem.byId(id)
      )
    ).data.data,
};
