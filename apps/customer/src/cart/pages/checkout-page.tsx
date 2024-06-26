import { ArrowRight, CheckCircle, ChevronLeft, Loader2 } from "lucide-react";
import { Suspense, lazy, useState } from "react";
import { IconType } from "react-icons";
import { BsBank, BsCashStack } from "react-icons/bs";
import { FaRegCreditCard } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";

import useCartStore from "@src/cart/stores/cart-store";
import PageMeta from "@src/common/components/page-meta";
import { useSocketContext } from "@src/common/contexts/socket";
import useInfinte from "@src/common/hooks/use-infinite";
import { NSRestaurant } from "@src/common/types/restaurant.type";
import { K_TABLE_ID } from "@src/common/utils/constants";
import { MenuPage, PAGES } from "@src/common/utils/pages";
import useOrder from "@src/orders/hooks/use-order";
import usePayment from "@src/orders/hooks/use-payment";
import { TableCard } from "@src/restaurants/components/table-card";
import useRestaurant from "@src/restaurants/hooks/use-restaurant";
import { tableService } from "@src/restaurants/services/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Button, Typography } from "@ui/components";
import { SOCKET_EVENTS } from "@ui/lib/socket-events";
import { cn } from "@ui/lib/utils";
import CartPage from "./cart-page";

const Empty = lazy(() => import("@src/common/components/empty"));

const PAYMENT_METHODS: { method: NSRestaurant.PAYMENT_METHOD; icon?: IconType; img?: string }[] = [
  {
    method: "UPI",
    img: "/upi.png",
  },
  {
    method: "CASH",
    icon: BsCashStack,
  },
  {
    method: "CARD",
    icon: FaRegCreditCard,
  },
  {
    method: "NETBANKING",
    icon: BsBank,
  },
];

///-------------------------------------------------------------------------------------

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { socket } = useSocketContext();
  const { cart, clearCart } = useCartStore();

  const [step, setStep] = useState("confirm-delivery-table");
  const { restaurant, isLoadingRestaurant } = useRestaurant({});
  const [table, setTable] = useState(localStorage.getItem(K_TABLE_ID) || "");
  const [paymentMethod, setPaymentMethod] = useState<NSRestaurant.PAYMENT_METHOD>("UPI");
  const { isPending, showRazorpay, getRzpOrderId } = usePayment({
    onSuccess: (orderId) => {
      socket?.emit(SOCKET_EVENTS.PAYMENT_SUCCESS, { to: restaurant?.data?.admin?._id, payload: orderId });
      navigate(PAGES.OrdersDetailsPage(orderId).href);
    },
  });

  const { createOrder, isCreating } = useOrder({
    fetchMenuItems: false,
    onSuccess: async (data) => {
      clearCart();
      if (data) {
        socket?.emit(SOCKET_EVENTS.ORDER_CREATED, { to: restaurant?.data?.admin?._id, payload: data });
        if (paymentMethod === "CASH") {
          navigate(PAGES.OrdersDetailsPage(data._id).href);
          return;
        }
        const rzpOrderId = await getRzpOrderId({ orderId: data._id, amount: data.total });
        await showRazorpay({ rzpOrderId, amount: data.total, dbOrderId: data._id });
      }
    },
  });

  const handleCreateOrder = () => {
    const payload = {
      paymentMethod,
      items: cart.map((item) => {
        return {
          item: item._id,
          quantity: item.quantity,
          addons: item.addOns.map((addon) => addon._id),
        };
      }),
    };
    createOrder(payload);
  };

  return (
    <main className="pt-8 px-4 space-y-4">
      <PageMeta title={PAGES.CheckoutPage.title} description={PAGES.CheckoutPage.description} />
      <div className="flex gap-x-4 items-center mb-4">
        <button onClick={() => navigate(-1)}>
          <ChevronLeft />
        </button>
        <h1 className="text-base font-medium">Checkout</h1>
      </div>
      {cart.length > 0 ? (
        <>
          <Accordion disabled={isCreating} value={step} onValueChange={(val) => setStep(val)} type="single" collapsible className="w-full space-y-2">
            {accordionData({
              table,
              setTable,
              paymentMethod,
              setPaymentMethod,
            }).map(({ value, title, content }, idx) => (
              <AccordionItem key={idx} value={value}>
                <AccordionTrigger className="bg-input">
                  <div className="text-sm">
                    <span className="text-muted-foreground w-fit mr-4">step: {idx + 1}</span> {title}
                  </div>
                </AccordionTrigger>
                <AccordionContent>{content}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <Button
            size="sm"
            className="w-full"
            onClick={handleCreateOrder}
            loading={isCreating || isLoadingRestaurant || isPending}
            endContent={<CheckCircle className="w-4" />}
            disabled={!cart.length || isCreating || isPending || !table || !paymentMethod}
          >
            {paymentMethod === "CASH" ? "Place order" : "Confirm Order"}
          </Button>
        </>
      ) : (
        <Suspense>
          <Empty notFoundTitle="Cart is empty!" notFoundDescription="Start exploring and add items to the cart you like!">
            <Link to={MenuPage.href} className="max-w-fit mx-auto">
              <Button size="sm" endContent={<ArrowRight size={16} />}>
                Explore
              </Button>
            </Link>
          </Empty>
        </Suspense>
      )}
    </main>
  );
};

export default CheckoutPage;

const TableSelect = ({ tableId, setTableId }: { tableId: string; setTableId: (id: string) => void }) => {
  const { data, isFetchingNextPage, isLoading, ref } = useInfinte({
    queryKey: ["tables"],
    fetcher: tableService.getTables,
    filters: { status: "AVAILABLE" },
  });

  return (
    <section id="tables" className="space-y-4">
      <div className="flex gap-x-4 items-center max-w-full overflow-auto no-scrollbar p-4">
        {!!data?.length &&
          data.length > 0 &&
          data.map((table, idx) => (
            <TableCard
              key={idx}
              selectable
              onClick={() => {
                setTableId(table._id);
                localStorage.setItem(K_TABLE_ID, table._id);
              }}
              selectedTableId={tableId}
              endRef={idx === data.length - 1 ? ref : undefined}
              className={cn(tableId === table._id ? "" : "bg-input border-gray-300 dark:border-input")}
              {...table}
            />
          ))}
        {(isFetchingNextPage || isLoading) && <Loader2 className="size-6 animate-spin text-primary" />}
      </div>
    </section>
  );
};

const accordionData = ({
  table,
  setTable,
  setPaymentMethod,
  paymentMethod,
}: {
  table: string;
  setTable: (table: string) => void;
  paymentMethod: NSRestaurant.PAYMENT_METHOD;
  setPaymentMethod: (method: NSRestaurant.PAYMENT_METHOD) => void;
}) => [
  {
    title: "Confirm delivery table",
    content: <TableSelect tableId={table} setTableId={setTable} />,
    value: "confirm-delivery-table",
  },
  {
    title: "Order Summary",
    content: <CartPage noPad showCheckout={false} />,
    value: "order-summary",
  },
  {
    title: "Payment options",
    content: (
      <div className="p-4 flex gap-x-4 overflow-x-auto no-scrollbar">
        {PAYMENT_METHODS.map(({ method, icon: Icon, img }, idx) => (
          <button
            key={idx}
            onClick={() => setPaymentMethod(method)}
            className={cn(
              "flex-col gap-4 border border-input min-w-28 h-28 text-gray-600 bg-input flex items-center justify-center rounded-md",
              paymentMethod === method && "border-primary bg-primary/10 text-primary",
            )}
          >
            {Icon && <Icon className="size-8" />}
            {img && <img src={img} alt={img} className="size-8 object-contain" />}
            <Typography className="capitalize">{method.toLowerCase()}</Typography>
          </button>
        ))}
      </div>
    ),
    value: "payment-options",
  },
];
