import { NSRestaurant } from "@src/common/types/restaurant.type";
import { ROUTES } from "@src/common/utils/api-routes";
import axiosInstance from "@src/common/utils/axios";
import { K_RESTAURANT_ID } from "@src/common/utils/constants";
import { IListRestaurantFilters } from "@src/restaurants/hooks/use-restaurant";

export const restaurantService = {
  async getRestroById(id: string | null = localStorage.getItem(K_RESTAURANT_ID), filters?: IListRestaurantFilters) {
    if (!id) throw new Error("Restaurant Id Not found!");
    let path = ROUTES.restaurant.byId(id);
    if (filters?.includeTables) {
      path += "?includeTables=true";
    }
    const res = await axiosInstance.get<NSCommon.ApiResponse<NSRestaurant.IResturant>>(path);
    return res.data;
  },
  async getRestaurantsList({ q }: { q?: string }) {
    let path = ROUTES.restaurant.list;
    if (q) path += `?q=${q}`;
    const res = await axiosInstance.get<NSCommon.IListRespone<NSRestaurant.IResturant[]>>(path);
    return res.data.data;
  },
};
