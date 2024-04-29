import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { categoryService } from "../services/category";

const useInfiniteCateory = () => {
  const { ref: refCat, inView: inViewCat } = useInView();
  const restaurantId = localStorage.getItem("restaurantId");

  const {
    data: iCategories,
    isLoading: isLoadingCategoriesFirstTime,
    hasNextPage: hasNextCatPage,
    fetchNextPage: fetchNextCatPage,
    isFetchingNextPage: isFetchingNextCatPage,
  } = useInfiniteQuery<any>({
    queryKey: ["categories", restaurantId],
    queryFn: async (props) => {
      const result = (await categoryService.getCategories({ page: props.pageParam!.toString() })).result;
      return result.length === 0 ? undefined : result;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage?.length ? allPages.length + 1 : undefined;
    },
  });

  const categories = iCategories?.pages.filter(Boolean).flat() ?? [];

  useEffect(() => {
    if (inViewCat && hasNextCatPage) {
      fetchNextCatPage();
    }
  }, [inViewCat]);

  return {
    refCat,
    categories,
    isLoadingCategoriesFirstTime,
    hasNextCatPage,
    isFetchingNextCatPage,
  };
};

export default useInfiniteCateory;
