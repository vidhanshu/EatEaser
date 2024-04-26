import { useMemo } from "react";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

import useTable from "@src/restaurant/hooks/use-table";
import {
  Button,
  Typography,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@ui/components";
import { GridSkeleton } from "@src/common/components/skeletons";
import { CreateTableForm, TableCard } from "@src/restaurant/components/table";
import { NoTablesFound } from "../components/table/no-tables-found";
import GenericUrlCruDialog from "@src/common/components/generic-url-cru-dialog";
import { APP_ROUTES } from "@src/common/utils/app-routes";

// -------------------------------------------------------------------------------

const TABLE_TABS = [
  {
    value: "ALL",
    label: "All",
  },
  {
    value: "AVAILABLE",
    label: "Available",
  },
  {
    value: "OCCUPIED",
    label: "Occupied",
  },
  {
    value: "RESERVED",
    label: "Reserved",
  },
];

// -------------------------------------------------------------------------------

const TablePage = () => {
  const { tables, loading, deleteTable } = useTable({});

  const AVL = useMemo(() => {
    return tables?.result.filter((table) => table.status === "AVAILABLE") ?? [];
  }, [tables?.result]);

  const OCC = useMemo(() => {
    return tables?.result.filter((table) => table.status === "OCCUPIED") ?? [];
  }, [tables?.result]);

  const RSV = useMemo(() => {
    return tables?.result.filter((table) => table.status === "RESERVED") ?? [];
  }, [tables?.result]);

  const data = {
    ALL: tables?.result ?? [],
    AVAILABLE: AVL,
    OCCUPIED: OCC,
    RESERVED: RSV,
  };

  if (loading) return <GridSkeleton />;

  if (!tables?.result.length) {
    return <NoTablesFound />;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <Typography className="mb-2 border-b-0" variant="h2">
          Tables
        </Typography>
        <GenericUrlCruDialog onCloseNavigateTo={APP_ROUTES.restaurantTables}>
          {(mode, id) => <CreateTableForm mode={mode} id={id} />}
        </GenericUrlCruDialog>
        <Link to="/restaurant/tables?mode=create">
          <Button startContent={<Plus size={16} />}>Create</Button>
        </Link>
      </div>
      <Tabs defaultValue="ALL">
        <TabsList className="mb-4 bg-gray-200 dark:bg-gray-800 space-x-6">
          {TABLE_TABS.map((tab) => (
            <TabsTrigger
              className="relative hover:bg-gray-300 dark:hover:bg-gray-900"
              key={tab.value}
              value={tab.value}
            >
              {tab.label}
              <div className="z-10 absolute -top-2 -right-2 rounded-full bg-rose-500 text-white text-xs w-4 h-4">
                {data[tab.value as keyof typeof data].length}
              </div>
            </TabsTrigger>
          ))}
        </TabsList>
        {TABLE_TABS.map((tab) => {
          return (
            <TabsContent key={tab.label} value={tab.value}>
              {data[tab.value as keyof typeof data].length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {data[tab.value as keyof typeof data].map((table) => (
                    <TableCard
                      key={table._id}
                      _id={table._id}
                      capacity={table.capacity}
                      name={table.name}
                      status={table.status}
                      handleDelete={(_id: string) => {
                        deleteTable({ _id });
                      }}
                    />
                  ))}
                </div>
              ) : (
                <NoTablesFound
                  status={tab.value as any}
                  placeholder={`No tables found for "${tab.value.toLowerCase()}" status`}
                />
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

export default TablePage;
