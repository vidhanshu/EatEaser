import { useQuery } from "@tanstack/react-query";
import { tableService } from "../services/table";
import { NSRestaurant } from "@src/common/types/restaurant.type";

const useTable = ({ fetchTables = true, variables: { tableId } = {} }: { fetchTables?: boolean; variables?: { tableId?: string } }) => {
  // Feth tables
  const { data: tables, isLoading: isLoadingTables } = useQuery({
    queryKey: ["tables"],
    queryFn: tableService.getTables,
    enabled: fetchTables,
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
    isLoadingTables,
    isLoadingTable: isLoading,
    getById: refetch,
  };
};

export default useTable;
