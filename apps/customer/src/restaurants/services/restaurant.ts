import { NSRestaurant } from "@src/common/types/restaurant.type";
import { ROUTES } from "@src/common/utils/api-routes";
import axiosInstance from "@src/common/utils/axios";
import { IListRestaurantFilters } from "@src/restaurants/hooks/use-restaurant";

export const restaurantService = {
  async getRestroById(id: string | null = localStorage.getItem("restaurantId"), filters?: IListRestaurantFilters) {
    if (!id) throw new Error("Restaurant Id Not found!");
    let path = ROUTES.restaurant.byId(id);
    if (filters?.includeTables) {
      path += "?includeTables=true";
    }
    const res = await axiosInstance.get<NSCommon.ApiResponse<NSRestaurant.IResturant>>(path);
    return res.data;
  },
};
