import paymentRecived from "@src/common/assets/sounds/payment_received.mp3";
import { GenericTable } from "@src/common/components/generic-table";
import { useSocketContext } from "@src/common/contexts/socket";
import { NSRestaurant } from "@src/types/restaurant.type";
import { ColumnDef } from "@tanstack/react-table";
import { Button, ImgWithPlaceholder, LimitedNameViewer, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Typography } from "@ui/components";
import { useAudio } from "@ui/hooks/use-audio";
import { SOCKET_EVENTS } from "@ui/lib/socket-events";
import dayjs from "dayjs";
import { ArrowUpDown, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Socket } from "socket.io-client";
import useOrder from "../hooks/use-order";
import { K_ORDER_STATUS_OPTIONS, K_PAYMENT_STATUS_OPTIONS, k_PAYMENT_METHOD_OPTIONS } from "../utils/constants";

//--------------------------------------------------------------------------------------------

export const columns: (props: {
  updateOrder: (payload: NSRestaurant.IUpadetOrderPayload) => void;
  loading: boolean;
  socket: Socket | null;
}) => ColumnDef<NSRestaurant.IOrder>[] = ({ updateOrder, loading, socket }) => [
  {
    accessorKey: "customer.name",
    header: "Customer name",
    cell: ({ row }) => {
      return (
        <Link className="hover:underline" to={"#"}>
          <Typography className="w-32">{row.original.customer.name}</Typography>
        </Link>
      );
    },
  },
  {
    accessorKey: "createdAt",
    cell: ({ row }) => {
      return <Typography>{dayjs(row.original.createdAt).format("DD MMM, YY h:mm a")}</Typography>;
    },
    header: ({ column }) => {
      return (
        <Button variant="ghost" className="hover:bg-gray-200 dark:hover:bg-muted/50" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Date time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    header: "Item",
    cell: ({ row }) => {
      const images = row.original.items
        .map((item) => item.item.image)
        .filter(Boolean)
        .slice(0, 3) as string[];

      return (
        <div className="flex gap-x-2 items-center">
          <ImgWithPlaceholder className="dark:bg-gray-900 object-contain bg-gray-200 w-16 min-w-16 h-16" src={images?.[0]} placeHolderProps={{ variant: "h5" }} placeholder="M I" />
          <LimitedNameViewer names={row.original.items.map((item) => item.item.name)} />
        </div>
      );
    },
  },
  {
    id: "Status",
    header: "Status",
    cell: ({ row: { original } }) => {
      return (
        <Select
          value={original.status}
          onValueChange={(status: NSRestaurant.ORDER_STATUS) => {
            updateOrder({ id: original._id, payload: { status } });
            socket?.emit(SOCKET_EVENTS.ORDER_UPDATED, { to: original.customer?._id, payload: { ...original, status }, notify: true });
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
    cell: ({ row: { original } }) => {
      return (
        <Select
          value={original.payment.status}
          onValueChange={(paymentStatus: NSRestaurant.PAYMENT_STATUS) => {
            updateOrder({ id: original._id, payload: { paymentStatus } });
            socket?.emit(SOCKET_EVENTS.ORDER_UPDATED, { to: original.customer?._id, payload: { ...original, payment: { ...original.payment, status: paymentStatus } } });
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
  const { elm, onPlayMusic } = useAudio({ src: paymentRecived });
  const [results, setResults] = useState<NSRestaurant.IOrder[]>([]);
  const [page, setPage] = useState(1);
  const { socket } = useSocketContext();

  const { orders, isLoadingOrders, updateOrder, isUpdating, isFetchingOrders } = useOrder({
    variables: { filters: { page } },
  });

  useEffect(() => {
    if (orders?.result?.length) {
      setResults(orders.result);
    }
  }, [orders]);

  useEffect(() => {
    if (!socket) return;
    const handleAddNewOrder = (order: NSRestaurant.IOrder) => {
      setResults((prev) => [order, ...prev]);
    };
    const handleCancelOrder = (orderId: string) => {
      setResults((prev) => prev.map((order) => (order._id === orderId ? { ...order, status: "CANCELLED" } : order)));
    };
    const handlePaymentSuccess = (orderId: string) => {
      setResults((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? {
                ...order,
                payment: {
                  ...order.payment,
                  status: "COMPLETED",
                },
              }
            : order,
        ),
      );
      onPlayMusic();
    };

    socket.on(SOCKET_EVENTS.ORDER_CREATED, handleAddNewOrder);
    socket.on(SOCKET_EVENTS.ORDER_CANCELLED, handleCancelOrder);
    socket.on(SOCKET_EVENTS.PAYMENT_SUCCESS, handlePaymentSuccess);
    return () => {
      socket.off(SOCKET_EVENTS.ORDER_CREATED, handleAddNewOrder);
      socket.off(SOCKET_EVENTS.ORDER_CANCELLED, handleCancelOrder);
      socket.off(SOCKET_EVENTS.PAYMENT_SUCCESS, handlePaymentSuccess);
    };
  }, [socket]);

  if (isLoadingOrders) {
    return <Loader2 size={25} className="animate-spin" />;
  }
  return (
    <div>
      {elm}
      <Typography className="my-4" variant="h4">
        Orders
      </Typography>
      <GenericTable
        page={page}
        setPage={setPage}
        data={results ?? []}
        searchColumnName="customer_name"
        totalPages={orders?.totalPages ?? 1}
        searchPlaceholder="Filter by customer name"
        columns={columns({ updateOrder, loading: isUpdating || isFetchingOrders, socket })}
      />
    </div>
  );
};

export default OrdersPage;
