import { AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";

import { toast } from "@ui/components";
import { NSRestaurant } from "@src/types/restaurant.type";
import { tableService } from "@src/restaurant/services/table";

const useTable = ({
  fetchTables = true,
  variables: { tableId } = {},
  onSuccess,
}: {
  fetchTables?: boolean;
  variables?: { tableId?: string };
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  // Feth tables
  const { data: tables, isPending } = useQuery({
    queryKey: ["tables"],
    queryFn: tableService.getTables,
    enabled: fetchTables,
  });

  // update table
  const { isPending: isUpdating, mutate: updatedTable } = useMutation({
    mutationFn: tableService.updateTable,
    onSuccess: () => {
      toast.success("Table updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["tables"],
      });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error?.message);
    },
  });

  // create table
  const { isPending: isCreating, mutate: createTable } = useMutation({
    mutationFn: tableService.createTable,
    onSuccess: () => {
      toast.success("Table created successfully");
      queryClient.invalidateQueries({
        queryKey: ["tables"],
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

  // delete table
  const { isPending: isDeleting, mutate: deleteTable } = useMutation({
    mutationFn: tableService.deleteTable,
    onSuccess: () => {
      toast.success("Table deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["tables"],
      });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error?.message);
    },
  });

  // get by id
  const {
    data: table,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["table", tableId],
    queryFn: async ({ queryKey }) => {
      const [, tableId] = queryKey;
      if (tableId) {
        return tableService.getTableBy(tableId);
      }
    },
    enabled: false,
  });

  return {
    tables,
    table: table as NSRestaurant.ITable,
    loading: isPending || isUpdating || isCreating || isDeleting || isLoading,
    updatedTable,
    deleteTable,
    createTable,
    getById: refetch,
  };
};

export default useTable;
