import { ROUTES } from "@src/common/utils/api-routes";
import axiosInstance from "@src/common/utils/axios";
import { NSRestaurant } from "@src/common/types/restaurant.type";
import { ICategoryFilter } from "@src/menu/hooks/use-categories";

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
    const restId = localStorage.getItem("restaurantId");
    if (!restId) throw new Error("Restaurant Id not found");

    return (
      (
        await axiosInstance.get(
          `${ROUTES.restaurant.category.list(restId)}?${sp.toString()}`
        )
      ).data.data ?? []
    );
  },
  getById: async (
    id: string
  ): Promise<NSCommon.ApiResponse<NSRestaurant.ICategory>["data"]> =>
    (await axiosInstance.get(ROUTES.restaurant.category.byId(id))).data.data,
};
