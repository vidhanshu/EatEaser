import useOrder from "@src/cart/hooks/use-order";
import { orderService } from "@src/cart/services/order";
import Empty from "@src/common/components/empty";
import PageMeta from "@src/common/components/page-meta";
import CSkeleton from "@src/common/components/skeleton";
import StatusChip from "@src/common/components/status-chip";
import useInfinte from "@src/common/hooks/use-infinite";
import { NSRestaurant } from "@src/common/types/restaurant.type";
import { PAGES } from "@src/common/utils/pages";
import { Button, ImgWithPlaceholder, Separator, Typography } from "@ui/components";
import { cn } from "@ui/lib/utils";
import { ChevronLeft, IndianRupee, Loader2, XCircle } from "lucide-react";
import { Ref } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const TABS = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Active",
    value: "PENDING",
  },
  {
    label: "Confirmed",
    value: "CONFIRMED",
  },
  {
    label: "Completed",
    value: "COMPLETED",
  },
  {
    label: "Cancelled",
    value: "CANCELLED",
  },
];
const OrdersPage = () => {
  const navigate = useNavigate();
  const [sp, ssp] = useSearchParams();
  const status = sp.get("status");

  const { data, isFetchingNextPage, isLoading, ref } = useInfinte({
    fetcher: orderService.getOrders,
    queryKey: ["orders"],
    filters: {
      status,
    },
  });

  return (
    <main className="pt-8 px-4">
      <PageMeta title={PAGES.OrdersPage.title} description={PAGES.OrdersPage.description} />
      <div className="flex gap-x-4 items-center mb-4">
        <button onClick={() => navigate(-1)}>
          <ChevronLeft />
        </button>
        <h1 className="text-base font-medium">Orders</h1>
      </div>
      <section>
        <div className="pt-4 mb-4 flex items-center justify-between sticky top-14 z-10 bg-background no-scrollbar overflow-x-auto">
          {TABS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => ssp({ status: value })}
              className={cn("py-2 text-sm text-center flex-1 min-w-28 border-b-[3px]", ((!status && value === "all") || status === value) && "border-primary")}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }, () => (
                <CSkeleton className="h-28 rounded-md" />
              ))}
            </div>
          ) : data.length === 0 && !isLoading ? (
            <Empty className="mt-8" notFoundTitle={`No ${status === "all" ? "" : status?.toLocaleLowerCase()} Orders found!`} notFoundDescription="" />
          ) : (
            data.map((order, idx) => (
              <OrderCard
                orderId={order._id}
                items={order.items}
                total={order.total}
                status={order.status}
                paymentStatus={order.payment.status}
                endRef={idx + 1 === data.length ? ref : null}
              />
            ))
          )}
          {isFetchingNextPage && <Loader2 size={24} className="animate-spin mx-auto text-primary" />}
        </div>
      </section>
    </main>
  );
};

export default OrdersPage;

const OrderCard = ({
  orderId,
  total,
  paymentStatus,
  items,
  endRef,
  status,
}: {
  orderId: string;
  total: number;
  paymentStatus: NSRestaurant.PAYMENT_STATUS;
  items: { item: { _id: string; name: string; image: string } }[];
  status: NSRestaurant.IOrder["status"];
  endRef?: Ref<HTMLDivElement>;
}) => {
  const { cancelOrder, isCancelingOrder } = useOrder({ fetchMenuItems: false });
  const images = items
    .map((item) => item.item.image)
    .filter(Boolean)
    .slice(0, 3) as string[];
  let itemsNames = items.map(({ item }) => item.name);
  const orderName = (
    <>
      <Typography variant="md" className="flex gap-x-2 items-center max-w-[300px] whitespace-nowrap truncate">
        {itemsNames.slice(0, 2).join(", ")}{" "}
        <Typography variant="muted" className="text-xs font-normal" title={itemsNames.slice(2).join(", ")}>
          {itemsNames.length > 2 ? ` +${itemsNames.length - 2} more` : ""}
        </Typography>
      </Typography>
    </>
  );

  return (
    <div ref={endRef} className="rounded-md bg-white shadow-sm dark:bg-input p-4">
      <Link to="/">
        <div className="flex gap-x-4">
          <ImgWithPlaceholder placeholder={itemsNames.slice(0, 2).join(", ")} className="size-20 rounded-sm" src={images?.[0]} />
          <div className="flex flex-col justify-between">
            {orderName}
            <Typography variant="muted">{items.length} Items</Typography>
            <div className="flex items-center divide-x-2">
              <Typography variant="md" className="flex text-lg gap-x-2 items-center text-primary pr-2">
                <IndianRupee size={20} /> {total}
              </Typography>
              <div className="flex pl-2 gap-x-2 items-center text-xs">
                Payment: <StatusChip text={paymentStatus} variant={paymentStatus === "PENDING" ? "warning" : paymentStatus === "FAILED" ? "destructive" : "success"} />
              </div>
            </div>
          </div>
        </div>
      </Link>
      {status === "PENDING" && (
        <>
          <Separator className="mt-4 mb-2 dark:bg-gray-800" />
          <div className="flex justify-end gap-x-4">
            <Button onClick={() => cancelOrder(orderId)} loading={isCancelingOrder} endContent={<XCircle size={16} />} variant="destructive" size="xs">
              Cancel
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
