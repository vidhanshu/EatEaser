import { NSRestaurant } from "@src/common/types/restaurant.type";
import { ROUTES } from "@src/common/utils/api-routes";
import axiosInstance from "@src/common/utils/axios";
import { K_RESTAURANT_ID } from "@src/common/utils/constants";

export const tableService = {
  async getTables({ status, page }: { status?: NSRestaurant.ITable["status"]; page?: number }) {
    const restId = localStorage.getItem(K_RESTAURANT_ID);
    if (!restId) throw new Error("Restaurant Id is required");
    const sp = new URLSearchParams();
    if (status !== undefined) sp.append("status", status);
    if (page !== undefined) sp.append("page", page.toString());

    return ((await axiosInstance.get(`${ROUTES.restaurant.table.list(restId)}?${sp.toString()}`)).data?.data ?? []) as NSCommon.IListRespone<NSRestaurant.ITable>["data"];
  },
  async getTableBy(tableId: string) {
    if (tableId) {
      return (await axiosInstance.get(ROUTES.restaurant.table.byId(tableId))).data?.data;
    }
  },
};
