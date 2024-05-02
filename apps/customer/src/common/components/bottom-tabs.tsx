import useCartStore from "@src/cart/stores/cart-store";
import { cn } from "@ui/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { BOTTOM_TABS } from "../utils/constants";

const activeMap = {
  Settings: ["/settings", "/profile", "/orders"],
  Home: ["/", "/menu"],
  Search: ["/search"],
  Cart: ["/cart"],
};
const BottomTabs = () => {
  const pathname = useLocation().pathname;
  const cart = useCartStore((store) => store.cart);

  return (
    <aside className="bg-white dark:bg-background border-t dark:border-input px-4 py-2 sticky bottom-0 inset-x-0 flex justify-between items-center">
      {BOTTOM_TABS.map(({ label, href, icon }) => {
        const mp = activeMap[label as "Settings" | "Home" | "Search" | "Cart"];
        const active = pathname.startsWith("/menu") ? label === "Home" : mp.includes(pathname);
        const Icon = icon(active);

        return (
          <Link key={label} to={href}>
            <button className="p-1 flex flex-col gap-1 items-center relative">
              <Icon className={active ? "text-primary" : "text-gray-600 dark:text-gray-500"} size={20} />
              <p className={cn("text-xs", active ? "text-primary" : "text-gray-600 dark:text-gray-500")}>{label}</p>
              {cart.length > 0 && label === "Cart" && (
                <div className="w-5 h-5 flex items-center justify-center rounded-full bg-primary absolute -top-2 -right-2 text-xs text-white">{cart.length}</div>
              )}
            </button>
          </Link>
        );
      })}
    </aside>
  );
};

export default BottomTabs;
