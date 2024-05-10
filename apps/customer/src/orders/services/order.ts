import { NSRestaurant } from "@src/common/types/restaurant.type";
import { ROUTES } from "@src/common/utils/api-routes";
import axiosInstance from "@src/common/utils/axios";
import { K_RESTAURANT_ID, K_TABLE_ID } from "@src/common/utils/constants";
import { NSCart } from "../../cart/types";

const ORDER_STATUS = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];
export const orderService = {
  getOrders: async ({ status, page }: { status?: NSRestaurant.IOrder["status"]; page?: number }): Promise<NSCommon.IListRespone<NSRestaurant.IOrder>["data"]> => {
    const sp = new URLSearchParams();
    if (status && ORDER_STATUS.includes(status)) sp.append("status", status);
    if (page) sp.append("page", page.toString());
    const rid = localStorage.getItem(K_RESTAURANT_ID);
    if (!rid) throw new Error("Restaurant id is required");
    return (await axiosInstance.get(`${ROUTES.restaurant.order.list(rid)}/?${sp.toString()}`)).data.data ?? [];
  },
  getOrderById: async (id: string): Promise<NSCommon.ApiResponse<NSRestaurant.IOrder>> => {
    return (await axiosInstance.get(ROUTES.restaurant.order.byId(id))).data;
  },
  cancelOrder: async (id: string) => (await axiosInstance.patch<NSCommon.ApiResponse<NSRestaurant.IMenuItem>>(ROUTES.restaurant.order.cancel(id))).data,
  createOrder: async (payload: NSCart.ICreateOrderPayload) => {
    const rid = localStorage.getItem(K_RESTAURANT_ID);
    const tid = localStorage.getItem(K_TABLE_ID);
    if (!rid || !tid) throw new Error("Table/Restaurant id is required");
    return (await axiosInstance.post<NSCommon.ApiResponse<NSRestaurant.IMenuItem>>(`${ROUTES.restaurant.order.create}?restaurantId=${rid}&tableId=${tid}`, payload)).data;
  },
  updateOrder: async ({ id, payload }: { id: string; payload: NSRestaurant.IOrder }) =>
    (await axiosInstance.patch<NSCommon.ApiResponse<NSRestaurant.IMenuItem>>(ROUTES.restaurant.order.update(id), payload)).data,
};
