import { useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import { BsCashStack } from "react-icons/bs";
import { FaRegCreditCard } from "react-icons/fa6";

import CartPage from "./cart-page";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Button, Typography } from "@repo/ui";
import { cn } from "@ui/lib/utils";
import { TableCard } from "@src/restaurants/components/table-card";
import useInfinte from "@src/common/hooks/use-infinite";
import { tableService } from "@src/restaurants/services/table";
import useCartStore from "../stores/cart-store";

const accordionData = ({
  table,
  setTable,
  setPaymentMethod,
  paymentMethod,
}: {
  table: string;
  setTable: (table: string) => void;
  paymentMethod: "online" | "cash";
  setPaymentMethod: (method: "online" | "cash") => void;
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
      <div className="p-4 flex gap-x-4 justify-center">
        <button
          onClick={() => setPaymentMethod("cash")}
          className={cn(
            "flex-col gap-4 border border-input size-28 text-gray-600 bg-white flex items-center justify-center rounded-md",
            paymentMethod === "cash" && "border-primary bg-primary/10 text-primary",
          )}
        >
          <BsCashStack className="size-8" />
          <Typography>Cash</Typography>
        </button>
        <button
          onClick={() => setPaymentMethod("online")}
          className={cn(
            "flex-col gap-4 border border-input size-28 text-gray-600 bg-white flex items-center justify-center rounded-md",
            paymentMethod === "online" && "border-primary bg-primary/10 text-primary",
          )}
        >
          <FaRegCreditCard className="size-8" />
          <Typography>Online</Typography>
        </button>
      </div>
    ),
    value: "payment-options",
  },
];
const CheckoutPage = () => {
  const [step, setStep] = useState("confirm-delivery-table");
  const [table, setTable] = useState(localStorage.getItem("tableId") || "");
  const { cart } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cash">("online");

  return (
    <main className="pt-8 px-4 space-y-4">
      <Accordion value={step} onValueChange={(val) => setStep(val)} type="single" collapsible className="w-full space-y-2">
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
      <Button disabled={!cart.length} size="sm" endContent={<CheckCircle className="w-4" />} className="w-full">
        Confirm Order
      </Button>
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
              endRef={idx === data.length - 1 ? ref : undefined}
              className={cn(tableId === table._id ? "" : "bg-input border-gray-300")}
              {...table}
            />
          ))}
        {(isFetchingNextPage || isLoading) && <Loader2 className="size-6 animate-spin text-primary" />}
      </div>
    </section>
  );
};
