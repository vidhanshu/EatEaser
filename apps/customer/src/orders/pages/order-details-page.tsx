import dayjs from "dayjs";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

import CartPage from "@src/cart/pages/cart-page";
import StatusChip from "@src/common/components/status-chip";
import { useSocketContext } from "@src/common/contexts/socket";
import OrderDetailsPageSkeleton from "@src/orders/components/skeleton/order-details-page-skeleton";
import useOrder from "@src/orders/hooks/use-order";
import useRestaurant from "@src/restaurants/hooks/use-restaurant";
import { Button, Separator, Typography } from "@ui/components";
import { SOCKET_EVENTS } from "@ui/lib/socket-events";
import { CheckCircle, Nfc } from "lucide-react";
import usePayment from "../hooks/use-payment";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const { socket } = useSocketContext();
  const { restaurant, isLoadingRestaurant } = useRestaurant({});
  const { order, getOrder, isLoadingOrder } = useOrder({ variables: { orderId: id } });
  const { isPending, showRazorpay, getRzpOrderId } = usePayment({
    onSuccess: () => {
      socket?.emit(SOCKET_EVENTS.PAYMENT_SUCCESS, { to: restaurant?.data?.admin?._id, payload: order?.data?._id });
      window.location.reload();
    },
  });

  useEffect(() => {
    getOrder();
  }, [id]);

  if (isLoadingOrder) return <OrderDetailsPageSkeleton />;

  return (
    <div className="pt-8">
      <div className="px-4 space-y-4">
        <Typography variant="h5">Order details</Typography>
        {order?.data && (
          <>
            <table cellPadding={8}>
              <tbody>
                <tr>
                  <td className="text-sm w-36">Order id:</td>
                  <td className="text-sm text-muted-foreground">#{order?.data?._id}</td>
                </tr>
                {order?.data?.payment.status === "COMPLETED" && (
                  <tr>
                    <td className="text-sm w-36">Payment id:</td>
                    <td className="text-sm text-muted-foreground">#{order?.data.payment.rzpPaymentId}</td>
                  </tr>
                )}
                <tr>
                  <td className="text-sm w-36">Date:</td>
                  <td className="text-sm text-muted-foreground">{dayjs(order?.data?.createdAt).format("DD MMM, YY h:mm a")}</td>
                </tr>
                <tr>
                  <td className="text-sm w-36">Table:</td>
                  <td className="text-sm text-muted-foreground">{order?.data?.table?.name}</td>
                </tr>
                <tr>
                  <td className="text-sm w-36">Order status:</td>
                  <td>
                    <StatusChip
                      text={order?.data?.status!}
                      variant={
                        order?.data?.status === "PENDING"
                          ? "warning"
                          : order?.data?.status === "CONFIRMED"
                            ? "info"
                            : order?.data?.status === "CANCELLED"
                              ? "destructive"
                              : "success"
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td className="text-sm w-36">Payment method:</td>
                  <td className="text-sm capitalize text-primary">{order?.data?.payment.method.toLowerCase()}</td>
                </tr>
                <tr>
                  <td className="text-sm w-36">Payment status:</td>
                  <td>
                    <StatusChip
                      text={order?.data?.payment.status!}
                      variant={order?.data?.payment.status === "PENDING" ? "warning" : order?.data?.payment.status === "FAILED" ? "destructive" : "success"}
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            <Separator />
          </>
        )}
      </div>
      <CartPage
        viewOnly
        totalTitle="Order total"
        notFoundTitle="Order not found!"
        notFoundDescription="Sorry, we couldn't find the order you're looking for."
        showCheckout={false}
        total={order?.data?.total}
        data={order?.data?.items.map((item) => ({ ...item.item, addOns: item.addons, quantity: item.quantity })) ?? []}
      />
      {order?.data && (
        <div className="px-4 pt-4">
          <Button
            loading={isPending || isLoadingRestaurant || isLoadingOrder}
            onClick={async () => {
              if (order.data && order.data.payment.status !== "COMPLETED") {
                let rzpOrderId = null;
                if (order.data.payment.rzpOrderId) {
                  rzpOrderId = order.data.payment.rzpOrderId;
                } else {
                  rzpOrderId = await getRzpOrderId({ orderId: order.data._id, amount: order.data.total });
                  // to refresh the order, to get the rzpOrderId so that, no blank rzp order would get created
                  getOrder();
                }
                console.log(rzpOrderId, order);
                await showRazorpay({
                  amount: order.data.total,
                  dbOrderId: order.data?._id,
                  rzpOrderId,
                });
              }
            }}
            className="w-full"
            disabled={order.data.payment.status === "COMPLETED"}
            endContent={order.data.payment.status !== "COMPLETED" ? <Nfc className="size-4" /> : <CheckCircle className="size-4" />}
          >
            {order.data.payment.status !== "COMPLETED" ? "Pay Online" : `Paid ₹${order.data.total}`}
          </Button>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsPage;
