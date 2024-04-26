import { ROUTES } from "@src/common/utils/api-routes";
import axiosInstance from "@src/common/utils/axios";
import { NSRestaurant } from "@src/types/restaurant.type";

export const restaurantService = {
  async getMyRestro() {
    const res = await axiosInstance.get<
      NSCommon.ApiResponse<NSRestaurant.IResturant>
    >(ROUTES.restaurant.myRestaurant);
    return res.data;
  },
  async updateRestro(payload: Partial<NSRestaurant.IResturant>) {
    const res = await axiosInstance.patch<
      NSCommon.ApiResponse<NSRestaurant.IResturant>
    >(ROUTES.restaurant.update, payload);
    return res.data;
  },
};
