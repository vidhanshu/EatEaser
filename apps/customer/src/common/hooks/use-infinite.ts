import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";

const useInfinte = ({ fetcher, queryKey, filters }: { fetcher: Function; filters?: Record<string, any>; queryKey: string[] }) => {
  const { ref, inView } = useInView();

  const {
    data: d,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery<any>({
    queryKey: [...queryKey, filters],
    queryFn: async (props) => {
      const result = (await fetcher({ page: props.pageParam!.toString(), ...filters })).result;
      return result.length === 0 ? undefined : result;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage?.length ? allPages.length + 1 : undefined;
    },
  });

  const data = d?.pages.filter(Boolean).flat() ?? [];

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView]);

  return {
    ref,
    data,
    isLoading,
    status,
    hasNextPage,
    isFetchingNextPage,
  };
};

export default useInfinte;
