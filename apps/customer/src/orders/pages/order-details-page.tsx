import CartPage from "@src/cart/pages/cart-page";
import StatusChip from "@src/common/components/status-chip";
import { Separator, Typography } from "@ui/components";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import OrderDetailsPageSkeleton from "../components/skeleton/order-details-page-skeleton";
import useOrder from "../hooks/use-order";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const { order, getOrder, isLoadingOrder } = useOrder({ variables: { orderId: id } });

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
    </div>
  );
};

export default OrderDetailsPage;
