import { ROUTES } from "@src/common/utils/api-routes";
import axiosInstance from "@src/common/utils/axios";
import { NSRestaurant } from "@src/types/restaurant.type";

const ORDER_STATUS = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];
export const orderService = {
  getOrders: async ({ status, page }: { status?: NSRestaurant.IOrder["status"]; page?: number }): Promise<NSCommon.IListRespone<NSRestaurant.IOrder>["data"]> => {
    const sp = new URLSearchParams();
    if (status && ORDER_STATUS.includes(status)) sp.append("status", status);
    if (page) sp.append("page", page.toString());
    return (await axiosInstance.get(`${ROUTES.restaurant.order.list}/?${sp.toString()}`)).data.data ?? [];
  },
  getOrderById: async (id: string): Promise<NSCommon.ApiResponse<NSRestaurant.IOrder>> => {
    return (await axiosInstance.get(ROUTES.restaurant.order.byId(id))).data;
  },
  updateOrder: async ({ id, payload }: NSRestaurant.IUpadetOrderPayload) =>
    (await axiosInstance.patch<NSCommon.ApiResponse<NSRestaurant.IMenuItem>>(ROUTES.restaurant.order.update(id), payload)).data,
};
