import { useQuery } from "@tanstack/react-query";

import { menuService } from "@src/menu/services/menu";

export interface IMenuFilters {
  isAvailable?: boolean;
  category?: string; // id of category
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
}: {
  fetchMenuItems?: boolean;
  variables?: { menuItemId?: string; filters?: IMenuFilters };
}) => {
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
      console.log("[filtersFROMHOok]", filters);
      return menuService.getMenuItems(filters);
    },
    enabled: fetchMenuItems,
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
    // Menu items stuff
    getMenuItems,
    menuItems,
    isFetchingMenuItems,
    isLoadingMenuItems,
    isRefetchingMenuItems,
  };
};

export default useMenu;
