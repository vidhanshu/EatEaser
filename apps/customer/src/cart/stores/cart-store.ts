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
  addAddon: (id: string, addon: NSRestaurant.IAddon) => void;
  removeAddon: (id: string, addonId: string) => void;
}

const useCartStore = create<ICartStore>()(
  persist(
    (set, get) => ({
      cart: [] as CartItem[],
      addToCart: (item) => {
        const cart = get().cart;
        const idx = cart.findIndex((i) => i._id === item._id);
        if (idx === -1) {
          const nItem = { ...item, addOns: [] };
          set({ cart: [...cart, nItem] });
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
      addAddon: (id, addon) => {
        const cart = get().cart;
        const idx = cart.findIndex((i) => i._id === id);
        if (idx !== -1) {
          set({
            cart: cart.map((i, index) => {
              if (index === idx) {
                i.addOns.push(addon);
              }
              return i;
            }),
          });
        }
      },
      removeAddon: (id, addonId) => {
        const cart = get().cart;
        console.log(id, addonId);
        const idx = cart.findIndex((i) => i._id === id);
        if (idx !== -1) {
          set({
            cart: cart.map((i, index) => {
              if (index === idx) {
                i.addOns = i.addOns.filter((a) => a._id !== addonId);
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
        const itemTotal = get().cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const addOnsTotal = get().cart.reduce((acc, item) => {
          return acc + item.addOns.reduce((acc2, addon) => acc2 + addon.price, 0);
        }, 0);

        return itemTotal + addOnsTotal;
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
