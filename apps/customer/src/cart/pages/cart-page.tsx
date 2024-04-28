import Menu from "@src/menu/components/menu";
import useCartStore from "../stores/cart-store";
import { Separator, TableBody, TableCell, TableRow, Table, Button } from "@repo/ui";
import { CheckCircle } from "lucide-react";
import React from "react";

const CartPage = () => {
  const { cart, calculateTotal } = useCartStore();

  return (
    <div className="pt-8 px-4 space-y-4">
      <Menu
        notFoundTitle="Cart is empty!"
        notFoundDescription="Please add items to cart to continue..."
        forCart
        isLoading={false}
        menuItems={cart}
        sectionTitle={`Cart (${cart.length} Items)`}
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
                  {item.addOns.map((addon) => (
                    <TableRow key={addon._id}>
                      <TableCell />
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
          <Button className="w-full" endContent={<CheckCircle size={16} />}>
            Place order
          </Button>
        </>
      )}
    </div>
  );
};

export default CartPage;
