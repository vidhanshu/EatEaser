import { AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";

import { toast } from "@ui/components";
import { categoryService } from "@src/menu/services/category";

export interface ICategoryFilter {
  q?: string;
  page?: string;
}
const useCategory = ({
  fetchCategories = true,
  variables: { categoryId, filters = {} } = {},
  onSuccess,
}: {
  fetchCategories?: boolean;
  variables?: { categoryId?: string; filters?: ICategoryFilter };
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  // Feth Categorys
  const {
    data: categories,
    isFetching: isFetchingCategories,
    isRefetching: isRefetchingCategories,
    isLoading: isLoadingCategories,
    refetch: getCategories,
  } = useQuery({
    queryKey: ["categories", filters],
    queryFn: () => {
      return categoryService.getCategories(filters);
    },
    enabled: fetchCategories,
  });

  // update category
  const { isPending: isUpdating, mutate: updateCategory } = useMutation({
    mutationFn: categoryService.updateCategory,
    onSuccess: () => {
      toast.success("Category updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error?.message);
    },
  });

  // create category
  const { isPending: isCreating, mutate: createCategory } = useMutation({
    mutationFn: categoryService.createCategory,
    onSuccess: () => {
      toast.success("Category created successfully");
      queryClient.invalidateQueries({
        queryKey: ["categories"],
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

  // delete category
  const { isPending: isDeleting, mutate: deleteCategory } = useMutation({
    mutationFn: categoryService.deleteCategory,
    onSuccess: () => {
      toast.success("Category deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error?.message);
    },
  });

  // get by id
  const {
    data: category,
    isFetching: isFetchingCategory,
    isLoading: isLoadingCategory,
    isRefetching: isRefetchingCategory,
    refetch: getCategory,
  } = useQuery({
    queryKey: ["category", categoryId],
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
    deleteCategory,
    createCategory,
    updateCategory,
    isFetchingCategory,
    categories,
    isUpdating,
    isCreating,
    isDeleting,
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
