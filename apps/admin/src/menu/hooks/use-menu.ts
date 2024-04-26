import { AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";

import { toast } from "@ui/components";
import { menuService } from "@src/menu/services/menu";
import { useEffect } from "react";

export interface IMenuFilters {
  isAvailable?: boolean;
  category?: string;
  isVegan?: boolean;
  isVegetarian?: boolean;
  minPrice?: string;
  maxPrice?: string;
  page?: number;
  q?: string;
}
const useMenu = ({
  fetchMenuItems = true,
  variables: { menuItemId, filters = {} } = {},
  onSuccess,
}: {
  fetchMenuItems?: boolean;
  variables?: { menuItemId?: string; filters?: IMenuFilters };
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  // Feth menu items
  const {
    data: menuItems,
    isFetching: isFetchingMenuItems, // this works on every load, doesn't matter wheather it is manual or made by react-query
    isLoading: isLoadingMenuItems, // this works on only initial load
    isRefetching: isRefetchingMenuItems, // this works on only refetching
    refetch: getMenuItems,
  } = useQuery({
    queryKey: ["menuItems", filters],
    queryFn: () => {
      return menuService.getMenuItems(filters);
    },
    enabled: fetchMenuItems,
  });

  // update menu item
  const { isPending: isUpdating, mutate: updateMenuItem } = useMutation({
    mutationFn: menuService.updateMenuItem,
    onSuccess: () => {
      toast.success("menu item updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["menuItems"],
      });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error?.message);
    },
  });

  // create menu item
  const { isPending: isCreating, mutate: createMenuItem } = useMutation({
    mutationFn: menuService.createMenuItem,
    onSuccess: () => {
      toast.success("menu item created successfully");
      queryClient.invalidateQueries({
        queryKey: ["menuItems"],
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

  // delete menu item
  const { isPending: isDeleting, mutate: deleteMenuItem } = useMutation({
    mutationFn: menuService.deleteMenuItem,
    onSuccess: () => {
      toast.success("Menu item deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["menuItems"],
      });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error?.message);
    },
  });

  // get by id
  const {
    data: menuItem,
    isFetching: isFetchingMenuItem,
    isRefetching: isRefetchingMenuItem,
    isLoading: isLoadingMenuItem,
    refetch: getMenuItem,
  } = useQuery({
    queryKey: ["menuItem", menuItemId],
    queryFn: async ({ queryKey }) => {
      const [, menuItemId] = queryKey;
      if (menuItemId) {
        return menuService.getById(menuItemId);
      }
    },
    enabled: false,
  });

  return {
    // Menu item stuff
    menuItem,
    getMenuItem,
    isFetchingMenuItem,
    isLoadingMenuItem,
    isRefetchingMenuItem,
    isUpdating,
    isDeleting,
    isCreating,
    deleteMenuItem,
    createMenuItem,
    updateMenuItem,
    // Menu items stuff
    getMenuItems,
    menuItems,
    isFetchingMenuItems,
    isLoadingMenuItems,
    isRefetchingMenuItems,
  };
};

export default useMenu;
