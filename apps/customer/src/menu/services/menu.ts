import { NSRestaurant } from "@src/common/types/restaurant.type";
import { ROUTES } from "@src/common/utils/api-routes";
import axiosInstance from "@src/common/utils/axios";
import { K_RESTAURANT_ID } from "@src/common/utils/constants";
import { IMenuFilters } from "../hooks/use-menu";

export const menuService = {
  getMenuItems: async ({ isAvailable, page, category, isVegan, isVegetarian, maxPrice, minPrice, q, sortBy }: IMenuFilters) => {
    const sp = new URLSearchParams();
    if (isAvailable !== undefined) sp.set("isAvailable", isAvailable.toString());
    if (page !== undefined) sp.set("page", page.toString());
    if (category !== undefined) sp.set("category", category);
    if (isVegan !== undefined) sp.set("isVegan", isVegan.toString());
    if (isVegetarian !== undefined) sp.set("isVegetarian", isVegetarian.toString());
    if (maxPrice !== undefined) sp.set("maxPrice", maxPrice.toString());
    if (minPrice !== undefined) sp.set("minPrice", minPrice.toString());
    if (q !== undefined && q.trim() != "") sp.set("q", q);
    if (sortBy !== undefined && sortBy === "price") sp.set("sort", "price:asc");

    const resId = localStorage.getItem(K_RESTAURANT_ID);
    if (!resId) throw new Error("Restaurant id not found in local storage");

    return ((await axiosInstance.get(`${ROUTES.restaurant.menuItem.list(resId)}?${sp.toString()}`)).data.data ?? []) as NSCommon.IListRespone<NSRestaurant.IMenuItem>["data"];
  },
  getById: async (id: string) => (await axiosInstance.get<NSCommon.ApiResponse<NSRestaurant.IMenuItem>>(ROUTES.restaurant.menuItem.byId(id))).data.data,
};
