import { GenericTable } from "@src/common/components/generic-table";
import { NSRestaurant } from "@src/types/restaurant.type";
import { ColumnDef } from "@tanstack/react-table";
import { Button, ImgWithPlaceholder, LimitedNameViewer, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Typography } from "@ui/components";
import { ArrowUpDown, Loader2 } from "lucide-react";
import { useState } from "react";
import useOrder from "../hooks/use-order";
import { K_ORDER_STATUS_OPTIONS, K_PAYMENT_STATUS_OPTIONS, k_PAYMENT_METHOD_OPTIONS } from "../utils/constants";

//--------------------------------------------------------------------------------------------

export const columns: ({ updateOrder, loading }: { updateOrder: (payload: NSRestaurant.IUpadetOrderPayload) => void; loading: boolean }) => ColumnDef<NSRestaurant.IOrder>[] = ({
  updateOrder,
  loading,
}) => [
  {
    header: "Item",
    cell: ({ row }) => {
      const images = row.original.items
        .map((item) => item.item.image)
        .filter(Boolean)
        .slice(0, 3) as string[];

      return (
        <div className="flex gap-x-2 items-center">
          <ImgWithPlaceholder className="dark:bg-gray-900 bg-gray-200 w-16 h-16" src={images?.[0]} placeHolderProps={{ variant: "h5" }} placeholder="M I" />
          <LimitedNameViewer names={row.original.items.map((item) => item.item.name)} />
        </div>
      );
    },
  },
  {
    id: "Status",
    header: "Status",
    cell: ({
      row: {
        original: { _id, status },
      },
    }) => {
      return (
        <Select
          value={status}
          onValueChange={(status: NSRestaurant.ORDER_STATUS) => {
            updateOrder({ id: _id, payload: { status } });
          }}
        >
          <SelectTrigger disabled={loading} className="w-32 h-8 text-xs">
            <SelectValue placeholder="Change payment status" />
          </SelectTrigger>
          <SelectContent>
            {K_ORDER_STATUS_OPTIONS.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    },
  },
  {
    header: "Payment status",
    accessorKey: "payment",
    cell: ({
      row: {
        original: {
          payment: { status },
          _id,
        },
      },
    }) => {
      return (
        <Select
          value={status}
          onValueChange={(paymentStatus: NSRestaurant.PAYMENT_STATUS) => {
            updateOrder({ id: _id, payload: { paymentStatus } });
          }}
        >
          <SelectTrigger disabled={loading} className="w-32 h-8 text-xs">
            <SelectValue placeholder="Change payment status" />
          </SelectTrigger>
          <SelectContent>
            {K_PAYMENT_STATUS_OPTIONS.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    },
  },
  {
    accessorKey: "table.name",
    cell: ({
      row: {
        original: {
          table: { name },
        },
      },
    }) => {
      return (
        <Typography className="pl-4" variant="small">
          {name}
        </Typography>
      );
    },
    header: ({ column }) => {
      return (
        <Button variant="ghost" className="hover:bg-gray-200 dark:hover:bg-muted/50" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Table
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    header: "Payment method",
    accessorKey: "payment.method",
    cell: ({
      row: {
        original: {
          payment: { method },
          _id,
        },
      },
    }) => {
      return (
        <Select
          value={method}
          onValueChange={(paymentMethod: NSRestaurant.PAYMENT_METHOD) => {
            updateOrder({ id: _id, payload: { paymentMethod } });
          }}
        >
          <SelectTrigger disabled={loading} className="w-32 h-8 text-xs">
            <SelectValue placeholder="Change payment status" />
          </SelectTrigger>
          <SelectContent>
            {k_PAYMENT_METHOD_OPTIONS.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    },
  },
  {
    accessorKey: "total",
    cell: ({
      row: {
        original: { total },
      },
    }) => {
      return <h1 className="pl-4">₹ {total}</h1>;
    },
    header: ({ column }) => {
      return (
        <Button variant="ghost" className="hover:bg-gray-200 dark:hover:bg-muted/50" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
];

//--------------------------------------------------------------------------------------------

const OrdersPage = () => {
  const [page, setPage] = useState(1);

  const { orders, isLoadingOrders, updateOrder, isUpdating, isFetchingOrders } = useOrder({
    variables: { filters: { page } },
  });

  if (isLoadingOrders) {
    return <Loader2 size={25} className="animate-spin" />;
  }
  return (
    <div>
      <Typography className="my-4" variant="h4">
        Orders
      </Typography>
      <GenericTable
        hideSearch
        page={page}
        setPage={setPage}
        columns={columns({ updateOrder, loading: isUpdating || isFetchingOrders })}
        totalPages={orders?.totalPages ?? 1}
        data={orders?.result ?? []}
      />
    </div>
  );
};

export default OrdersPage;
