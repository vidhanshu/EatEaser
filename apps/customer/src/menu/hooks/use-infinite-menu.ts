import { useInView } from "react-intersection-observer";
import { IMenuFilters } from "./use-menu";
import { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { menuService } from "../services/menu";

const useInfiniteMenu = ({ filters }: { filters?: IMenuFilters }) => {
  const { ref: refMenu, inView: inViewMenu } = useInView();
  const restaurantId = localStorage.getItem("restaurantId");

  const {
    data,
    isLoading: isLoadingMenuItemsFirstTime,
    hasNextPage: hasNextMenuPage,
    fetchNextPage: fetchNextMenuPage,
    isFetchingNextPage: isFetchingNextMenuPage,
  } = useInfiniteQuery<any>({
    queryKey: ["menuItems", { ...filters, restaurantId }],
    queryFn: async (props) => {
      const result = (await menuService.getMenuItems({ ...filters, page: props.pageParam as number })).result;
      return result.length === 0 ? undefined : result;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage?.length ? allPages.length + 1 : undefined;
    },
  });
  const menuItems = data?.pages.filter(Boolean).flat() ?? [];

  useEffect(() => {
    if (inViewMenu && hasNextMenuPage) {
      fetchNextMenuPage();
    }
  }, [inViewMenu]);

  return {
    refMenu,
    menuItems,
    isLoadingMenuItemsFirstTime,
    hasNextMenuPage,
    isFetchingNextMenuPage,
  };
};

export default useInfiniteMenu;
