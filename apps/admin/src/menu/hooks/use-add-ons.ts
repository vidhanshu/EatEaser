import { AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";

import { toast } from "@ui/components";
import { addOnsService } from "@src/menu/services/add-ons";
import { useEffect } from "react";

export interface IAddonFilter {
  q?: string;
  page?: string;
}
const useAddOns = ({
  fetchAddOns = true,
  variables: { addOnId, filters = {} } = {},
  onSuccess,
}: {
  fetchAddOns?: boolean;
  variables?: { addOnId?: string; filters?: IAddonFilter };
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  // Feth AddOns
  const {
    data: addOns,
    isFetching: isFetchingAddOns,
    isLoading: isLoadingAddOns,
    isRefetching: isRefetchingAddOns,
    refetch: getAddOns,
  } = useQuery({
    queryKey: ["addOns", filters],
    queryFn: () => {
      return addOnsService.getAddOns(filters);
    },
    enabled: fetchAddOns,
  });

  // update addOn
  const { isPending: isUpdating, mutate: updateAddOn } = useMutation({
    mutationFn: addOnsService.updateAddOn,
    onSuccess: () => {
      toast.success("AddOn updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["addOns", "addOn", addOnId],
      });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error?.message);
    },
  });

  // create addOn
  const { isPending: isCreating, mutate: createAddOn } = useMutation({
    mutationFn: addOnsService.createAddOn,
    onSuccess: () => {
      toast.success("AddOn created successfully");
      queryClient.invalidateQueries({
        queryKey: ["addOns"],
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

  // delete addOn
  const { isPending: isDeleting, mutate: deleteAddOn } = useMutation({
    mutationFn: addOnsService.deleteAddOn,
    onSuccess: () => {
      toast.success("AddOn deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["addOns"],
      });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error?.message);
    },
  });

  // get by id
  const {
    data: addOn,
    isFetching: isFetchingAddOn,
    isLoading: isLoadingAddOn,
    isRefetching: isRefetchingAddOn,
    refetch: getAddOn,
  } = useQuery({
    queryKey: ["addOn", addOnId],
    queryFn: async ({ queryKey }) => {
      const [, addOnId] = queryKey;
      if (addOnId) {
        return addOnsService.getById(addOnId);
      }
    },
    enabled: false,
  });

  return {
    // add on
    addOn,
    getAddOn,
    isFetchingAddOn,
    isRefetchingAddOn,
    isLoadingAddOn,
    isUpdating,
    isCreating,
    isDeleting,
    deleteAddOn,
    createAddOn,
    updateAddOn,
    // addOns
    addOns,
    isFetchingAddOns,
    isLoadingAddOns,
    isRefetchingAddOns,
    getAddOns,
  };
};

export default useAddOns;
