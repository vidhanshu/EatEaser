import { useQuery } from "@tanstack/react-query";

import { categoryService } from "@src/menu/services/category";

export interface ICategoryFilter {
  q?: string;
  page?: string;
  resultPerPage?: string;
}
const useCategory = ({
  fetchCategories = true,
  variables: { categoryId, filters = {} } = {},
  deps = [],
}: {
  fetchCategories?: boolean;
  variables?: { categoryId?: string; filters?: ICategoryFilter };
  deps?: string[];
}) => {
  // Fetch Categories
  const {
    data: categories,
    isFetching: isFetchingCategories,
    isRefetching: isRefetchingCategories,
    isLoading: isLoadingCategories,
    refetch: getCategories,
  } = useQuery({
    queryKey: ["categories", filters, ...deps],
    queryFn: () => {
      return categoryService.getCategories(filters);
    },
    enabled: fetchCategories,
  });

  // get by id
  const {
    data: category,
    isFetching: isFetchingCategory,
    isLoading: isLoadingCategory,
    isRefetching: isRefetchingCategory,
    refetch: getCategory,
  } = useQuery({
    queryKey: ["category", categoryId, ...deps],
    queryFn: async ({ queryKey }) => {
      const [, categoryId] = queryKey;
      if (categoryId) {
        return categoryService.getById(categoryId);
      }
    },
    enabled: false,
  });

  return {
    // category
    category,
    getCategory,
    isFetchingCategory,
    categories,
    isRefetchingCategory,
    isLoadingCategory,
    // categories
    getCategories,
    isFetchingCategories,
    isRefetchingCategories,
    isLoadingCategories,
  };
};

export default useCategory;
