import { create } from "zustand";
import { persist } from "zustand/middleware";
import { NSRestaurant } from "@src/common/types/restaurant.type";

interface CartItem extends NSRestaurant.IMenuItem {
  quantity: number;
}
interface ICartStore {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  changeQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  calculateTotal: () => number;
  isInCart: (id: string) => boolean;
  getCartItem: (id: string) => CartItem | undefined;
}

const useCartStore = create<ICartStore>()(
  persist(
    (set, get) => ({
      cart: [] as CartItem[],
      addToCart: (item) => {
        const cart = get().cart;
        const idx = cart.findIndex((i) => i._id === item._id);
        if (idx === -1) {
          set({ cart: [...cart, item] });
        } else {
          set({
            cart: cart.map((i, index) => {
              if (index === idx) {
                i.quantity = item.quantity;
              }
              return i;
            }),
          });
        }
      },
      removeFromCart: (id) => {
        const newCart = get().cart.filter((i) => i._id !== id);
        set({ cart: newCart });
      },
      changeQuantity: (id, quantity) => {
        const newCart = get().cart.map((i) => {
          if (i._id === id) {
            return { ...i, quantity };
          }
          return i;
        });
        set({ cart: newCart });
      },
      clearCart: () => {
        set({ cart: [] });
      },
      calculateTotal: () => {
        return get().cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
      },
      isInCart: (id) => {
        return get().cart.some((i) => i._id === id);
      },
      getCartItem: (id) => {
        return get().cart.find((i) => i._id === id);
      },
    }),
    { name: "cart" },
  ),
);

export default useCartStore;
