import { ROUTES } from "@src/common/utils/api-routes";
import axiosInstance from "@src/common/utils/axios";
import { NSRestaurant } from "@src/types/restaurant.type";
import { ICategoryFilter } from "../hooks/use-categories";

export const categoryService = {
  getCategories: async ({
    q,
    page,
  }: ICategoryFilter): Promise<
    NSCommon.IListRespone<NSRestaurant.ICategory>["data"]
  > => {
    const sp = new URLSearchParams();
    if (q !== undefined && q.trim() != "") sp.append("q", q);
    if (page !== undefined) sp.append("page", page);

    return (
      (
        await axiosInstance.get(
          `${ROUTES.restaurant.category.list}?${sp.toString()}`
        )
      ).data.data ?? []
    );
  },
  updateCategory: async ({
    id,
    payload,
  }: {
    id: string;
    payload: Partial<NSRestaurant.ICategory>;
  }): Promise<NSCommon.ApiResponse<NSRestaurant.ICategory>> =>
    (await axiosInstance.patch(ROUTES.restaurant.category.update(id), payload))
      .data,
  createCategory: async (
    payload: NSRestaurant.ICategory
  ): Promise<NSCommon.ApiResponse<NSRestaurant.ICategory>> =>
    (await axiosInstance.post(ROUTES.restaurant.category.create, payload)).data,
  deleteCategory: async ({
    id,
  }: {
    id: string;
  }): Promise<NSCommon.ApiResponse<NSRestaurant.ICategory>> =>
    (await axiosInstance.delete(ROUTES.restaurant.category.delete(id))).data,
  getById: async (
    id: string
  ): Promise<NSCommon.ApiResponse<NSRestaurant.ICategory>["data"]> =>
    (await axiosInstance.get(ROUTES.restaurant.category.byId(id))).data.data,
};
