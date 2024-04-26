import { ROUTES } from "@src/common/utils/api-routes";
import axiosInstance from "@src/common/utils/axios";
import { NSRestaurant } from "@src/types/restaurant.type";

export const tableService = {
  async getTables() {
    return ((await axiosInstance.get(ROUTES.restaurant.table.list)).data
      ?.data ?? []) as NSCommon.IListRespone<NSRestaurant.ITable>["data"];
  },
  async updateTable({
    data,
    id,
  }: {
    data: Partial<Omit<NSRestaurant.ITable, "restaurant" | "_id">>;
    id: string;
  }) {
    return (await axiosInstance.patch(ROUTES.restaurant.table.update(id), data))
      .data;
  },
  async createTable(
    payload: Omit<NSRestaurant.ITable, "restaurant" | "_id" | "qrCode">
  ) {
    return (await axiosInstance.post(ROUTES.restaurant.table.create, payload))
      .data;
  },
  async deleteTable(
    payload: Partial<Omit<NSRestaurant.ITable, "restaurant">> & {
      _id: string;
    }
  ) {
    return (
      await axiosInstance.delete(ROUTES.restaurant.table.delete(payload._id))
    ).data;
  },

  async getTableBy(tableId: string) {
    if (tableId) {
      return (await axiosInstance.get(ROUTES.restaurant.table.byId(tableId)))
        .data?.data;
    }
  },
};
