import Menu from "@src/menu/components/menu";
import useCartStore from "../stores/cart-store";
import { Separator, TableBody, TableCell, TableRow, Table, Button } from "@repo/ui";
import { CheckCircle } from "lucide-react";

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
          <Table>
            <TableBody>
              {cart.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    <div className="flex gap-x-2 items-center">
                      <span className="text-emerald-500">₹{item.price}</span>
                      <span>x {item.quantity}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-x-2 items-center">
                      <span className="text-emerald-500">₹{item.price * item.quantity}</span>
                    </div>
                  </TableCell>
                </TableRow>
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
