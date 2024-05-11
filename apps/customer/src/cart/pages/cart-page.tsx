import { CheckCircle } from "lucide-react";
import React, { lazy } from "react";
import { Link } from "react-router-dom";

import useCartStore from "@src/cart/stores/cart-store";
import PageMeta from "@src/common/components/page-meta";
import { NSRestaurant } from "@src/common/types/restaurant.type";
import { CheckoutPage, PAGES } from "@src/common/utils/pages";
import Menu from "@src/menu/components/menu";
import { Separator, Table, TableBody, TableCell, TableRow } from "@ui/components";
import { cn } from "@ui/lib/utils";

const Button = lazy(() => import("@ui/components/ui/button"));
const GenericAlertDialog = lazy(() => import("@ui/components/custom/generic-alert-dialog"));

///-----------------------------------------------------------------------------------------------------------------------

const CartPage = ({
  data,
  total,
  noPad = false,
  viewOnly = false,
  showCheckout = true,
  totalTitle = "Cart total",
  notFoundTitle = "Cart is empty!",
  notFoundDescription = "Please add items to cart to continue...",
}: {
  data?: (NSRestaurant.IMenuItem & { quantity: number })[];
  showCheckout?: boolean;
  noPad?: boolean;
  viewOnly?: boolean;
  total?: number;
  notFoundTitle?: string;
  notFoundDescription?: string;
  totalTitle?: string;
}) => {
  const { cart, calculateTotal, clearCart } = useCartStore();
  const cData = data?.length ? data : cart;
  const cTotal = total ?? calculateTotal();

  return (
    <div className={cn("pt-8 space-y-4", noPad ? "px-2" : "px-4")}>
      <PageMeta title={PAGES.CartPage.title} description={PAGES.CartPage.description} />
      <Menu
        forCart
        isLoading={false}
        menuItems={cData}
        viewOnly={viewOnly}
        notFoundTitle={notFoundTitle}
        notFoundDescription={notFoundDescription}
        sectionTitle={
          !viewOnly ? (
            <div className="flex justify-between items-center">
              <span>Cart ({cData.length} Items)</span>
              {cData.length > 0 && (
                <React.Suspense>
                  <GenericAlertDialog
                    onOk={() => clearCart()}
                    className="max-w-[95vw] w-fit min-w-[350px] rounded-md p-4 dark:border-gray-800"
                    title="Are you sure?"
                    description="Do you really want to clear the cart?"
                    okBtnTitle="Yes, clear it"
                  >
                    <span className="cursor-pointer text-xs underline text-rose-500">Empty cart</span>
                  </GenericAlertDialog>
                </React.Suspense>
              )}
            </div>
          ) : null
        }
      />
      {cData.length > 0 && (
        <>
          <Separator />
          <h1 className="font-medium">{totalTitle}</h1>
          <Table>
            <TableBody>
              {cData.map((item) => (
                <React.Fragment key={item._id}>
                  <TableRow>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>
                      <div className="flex gap-x-2 items-center">
                        <span className="text-primary">₹{item.price}</span>
                        <span>x {item.quantity}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-x-2 items-center">
                        <span className="text-primary">₹{item.price * item.quantity}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                  {item.addOns.map((addon, idx) => (
                    <TableRow key={addon._id}>
                      <TableCell>
                        <p className="text-muted-foreground text-xs">
                          Add on-{idx + 1}({item.name})
                        </p>
                      </TableCell>
                      <TableCell>{addon.name}</TableCell>
                      <TableCell colSpan={2}>
                        <div className="flex gap-x-2 items-center">
                          <span className="text-primary">₹{addon.price}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
              <TableRow>
                <TableCell>Total</TableCell>
                <TableCell></TableCell>
                <TableCell>₹{cTotal}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          {showCheckout && (
            <Link to={CheckoutPage.href}>
              <React.Suspense>
                <Button className="w-full" endContent={<CheckCircle size={16} />}>
                  Checkout
                </Button>
              </React.Suspense>
            </Link>
          )}
        </>
      )}
    </div>
  );
};

export default CartPage;
