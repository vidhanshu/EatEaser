import { ArrowRight, CheckCircle, ChevronLeft, Loader2 } from "lucide-react";
import { useState } from "react";
import { BsBank, BsCashStack } from "react-icons/bs";
import { FaRegCreditCard } from "react-icons/fa6";

import Empty from "@src/common/components/empty";
import PageMeta from "@src/common/components/page-meta";
import useInfinte from "@src/common/hooks/use-infinite";
import { NSRestaurant } from "@src/common/types/restaurant.type";
import { MenuPage, OrdersPage, PAGES } from "@src/common/utils/pages";
import { TableCard } from "@src/restaurants/components/table-card";
import { tableService } from "@src/restaurants/services/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Button, Typography } from "@ui/components";
import { cn } from "@ui/lib/utils";
import { IconType } from "react-icons";
import { Link, useNavigate } from "react-router-dom";
import useOrder from "../../orders/hooks/use-order";
import useCartStore from "../stores/cart-store";
import CartPage from "./cart-page";

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
  const { cart, clearCart } = useCartStore();
  const [step, setStep] = useState("confirm-delivery-table");
  const [table, setTable] = useState(localStorage.getItem("tableId") || "");
  const [paymentMethod, setPaymentMethod] = useState<NSRestaurant.PAYMENT_METHOD>("UPI");

  const { createOrder, isCreating } = useOrder({
    fetchMenuItems: false,
    onSuccess: () => {
      clearCart();
      navigate(OrdersPage.href);
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
          <Button onClick={handleCreateOrder} loading={isCreating} disabled={!cart.length || isCreating} size="sm" endContent={<CheckCircle className="w-4" />} className="w-full">
            Confirm Order
          </Button>
        </>
      ) : (
        <>
          <Empty notFoundTitle="Cart is empty!" notFoundDescription="Start exploring and add items to the cart you like!">
            <Link to={MenuPage.href} className="max-w-fit mx-auto">
              <Button size="sm" endContent={<ArrowRight size={16} />}>
                Explore
              </Button>
            </Link>
          </Empty>
        </>
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
                localStorage.setItem("tableId", table._id);
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
            <Typography className="lowercase">{method}</Typography>
          </button>
        ))}
      </div>
    ),
    value: "payment-options",
  },
];
