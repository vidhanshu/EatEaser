import axiosInstance from "@src/common/utils/axios";
import { ROUTES } from "@src/common/utils/api-routes";
import { NSRestaurant } from "@src/types/restaurant.type";
import { IAddonFilter } from "@src/menu/hooks/use-add-ons";

export const addOnsService = {
  getAddOns: async ({
    q,
    page,
  }: IAddonFilter): Promise<
    NSCommon.IListRespone<NSRestaurant.IAddon>["data"]
  > => {
    const sp = new URLSearchParams();
    if (q !== undefined && q.trim() != "") sp.append("q", q);
    if (page !== undefined) sp.append("page", page);
    return (
      (
        await axiosInstance.get(
          `${ROUTES.restaurant.addOn.list}?${sp.toString()}`
        )
      ).data.data ?? []
    );
  },

  updateAddOn: async ({
    id,
    payload,
  }: {
    id: string;
    payload: Partial<NSRestaurant.IAddon>;
  }): Promise<NSCommon.ApiResponse<NSRestaurant.IAddon>> =>
    (await axiosInstance.patch(ROUTES.restaurant.addOn.update(id), payload))
      .data,
  createAddOn: async (
    payload: NSRestaurant.IAddon
  ): Promise<NSCommon.ApiResponse<NSRestaurant.IAddon>> =>
    (await axiosInstance.post(ROUTES.restaurant.addOn.create, payload)).data,
  deleteAddOn: async ({
    id,
  }: {
    id: string;
  }): Promise<NSCommon.ApiResponse<NSRestaurant.IAddon>> =>
    (await axiosInstance.delete(ROUTES.restaurant.addOn.delete(id))).data,
  getById: async (
    id: string
  ): Promise<NSCommon.ApiResponse<NSRestaurant.IAddon>> =>
    (await axiosInstance.get(ROUTES.restaurant.addOn.byId(id))).data.data,
};
