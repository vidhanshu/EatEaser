import React from "react";
import { CheckCircle } from "lucide-react";

import Menu from "@src/menu/components/menu";
import useCartStore from "../stores/cart-store";
import { Separator, TableBody, TableCell, TableRow, Table, Button, GenericAlertDialog } from "@repo/ui";

const CartPage = () => {
  const { cart, calculateTotal, clearCart } = useCartStore();

  return (
    <div className="pt-8 px-4 space-y-4">
      <Menu
        notFoundTitle="Cart is empty!"
        notFoundDescription="Please add items to cart to continue..."
        forCart
        isLoading={false}
        menuItems={cart}
        sectionTitle={
          <div className="flex justify-between items-center">
            <span>Cart ({cart.length} Items)</span>
            {cart.length > 0 && (
              <GenericAlertDialog
                onOk={() => clearCart()}
                className="max-w-[95vw] w-fit min-w-[350px] rounded-md p-4 dark:border-gray-800"
                title="Are you sure?"
                description="Do you really want to clear the cart?"
                okBtnTitle="Yes, clear it"
              >
                <span className="cursor-pointer text-xs underline text-rose-500">Empty cart</span>
              </GenericAlertDialog>
            )}
          </div>
        }
      />
      {cart.length > 0 && (
        <>
          <Separator />
          <h1 className="font-medium">Cart Total</h1>
          <Table>
            <TableBody>
              {cart.map((item) => (
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
                <TableCell>₹{calculateTotal()}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Button onClick={() => {}} className="w-full" endContent={<CheckCircle size={16} />}>
            Checkout
          </Button>
        </>
      )}
    </div>
  );
};

export default CartPage;
