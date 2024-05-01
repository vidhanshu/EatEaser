import { AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";

import { toast } from "@ui/components";
import { orderService } from "../services/order";
import { NSRestaurant } from "@src/common/types/restaurant.type";

export interface IMenuFilters {
  status?: NSRestaurant.IOrder["status"];
  page?: number;
  q?: string;
}
const useOrder = ({
  fetchMenuItems = true,
  variables: { orderId, filters = {} } = {},
  onSuccess,
}: {
  fetchMenuItems?: boolean;
  variables?: { orderId?: string; filters?: IMenuFilters };
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  // Feth menu items
  const {
    data: orders,
    isFetching: isFetchingOrders, // this works on every load, doesn't matter wheather it is manual or made by react-query
    isLoading: isLoadingOrders, // this works on only initial load
    isRefetching: isRefetchingOrders, // this works on only refetching
    refetch: getOrders,
  } = useQuery({
    queryKey: ["orders", filters],
    queryFn: () => {
      return orderService.getOrders(filters ?? {});
    },
    enabled: fetchMenuItems,
  });

  // update order
  const { isPending: isUpdating, mutate: updateOrder } = useMutation({
    mutationFn: orderService.updateOrder,
    onSuccess: () => {
      toast.success("order updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error?.message);
    },
  });

  // create order
  const { isPending: isCreating, mutate: createOrder } = useMutation({
    mutationFn: orderService.createOrder,
    onSuccess: () => {
      toast.success("order created successfully");
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
      onSuccess?.();
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.error);
      } else {
        toast.error(error?.message);
      }
    },
  });

  // cancel order
  const { isPending: isCancelingOrder, mutate: cancelOrder } = useMutation({
    mutationFn: orderService.cancelOrder,
    onSuccess: () => {
      toast.success("Order cancelled successfully");
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error?.message);
    },
  });

  // get by id
  const {
    data: order,
    isFetching: isFetchingOrder,
    isRefetching: isRefetchingOrder,
    isLoading: isLoadingOrder,
    refetch: getOrder,
  } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async ({ queryKey }) => {
      const [, orderId] = queryKey;
      if (orderId) {
        return orderService.getOrderById(orderId);
      }
    },
    enabled: false,
  });

  return {
    // Order stuff
    order,
    getOrder,
    isFetchingOrder,
    isLoadingOrder,
    isRefetchingOrder,
    isUpdating,
    isCancelingOrder,
    isCreating,
    cancelOrder,
    createOrder,
    updateOrder,
    // Orders stuff
    getOrders,
    orders,
    isFetchingOrders,
    isLoadingOrders,
    isRefetchingOrders,
  };
};

export default useOrder;
