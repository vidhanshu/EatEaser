import { cn } from "@ui/lib/utils";
import { BOTTOM_TABS } from "../utils/constants";
import { Link, useLocation } from "react-router-dom";

const BottomTabs = () => {
  const pathname = useLocation().pathname;
  return (
    <aside className="bg-white dark:bg-black px-4 py-2 border fixed bottom-0 inset-x-0 flex justify-between items-center">
      {BOTTOM_TABS.map(({ label, href, icon }) => {
        const active = pathname === href;
        const Icon = icon(active);
        return (
          <Link key={label} to={href}>
            <button className="p-1 flex flex-col gap-1 items-center">
              <Icon className={active ? "text-emerald-500" : "text-gray-600"} size={20} />
              <p className={cn("text-xs", active ? "text-emerald-500" : "text-gray-600")}>{label}</p>
            </button>
          </Link>
        );
      })}
    </aside>
  );
};

export default BottomTabs;
