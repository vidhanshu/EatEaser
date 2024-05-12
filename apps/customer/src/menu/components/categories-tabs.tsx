import { Loader2 } from "lucide-react";
import { Ref, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";

import CSkeleton from "@src/common/components/skeleton";
import { NSRestaurant } from "@src/common/types/restaurant.type";
import { cn } from "@ui/lib/utils";
import { FilterDialog } from "./filters-dialog";

const CategoriesTabs = ({
  categories,
  isLoading,
  endRef,
  isFetchingNextCatPage,
}: {
  categories: NSRestaurant.ICategory[];
  isLoading: Boolean;
  isFetchingNextCatPage?: boolean;
  endRef: Ref<HTMLAnchorElement>;
}) => {
  const [sp] = useSearchParams();
  const category = sp.get("category");

  const categoriesWithAll = useMemo(
    () =>
      [{ name: "All", _id: "all", href: "/?category=all" }, ...categories.map((cat) => ({ ...cat, href: `/?category=${cat._id}` }))] as (NSRestaurant.ICategory & {
        href: string;
      })[],
    [categories],
  );

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-medium">Categories</h1>
        <Link className="text-sm text-emerald-600" to="/">
          View all
        </Link>
      </div>
      <div className="max-w-[calc(100vw-30px)] overflow-x-auto no-scrollbar">
        <div className="flex w-max space-x-4 items-center">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => <CSkeleton key={i} className="w-[64px] h-[33.5px] rounded-full" />)
          ) : (
            <>
              <FilterDialog />
              {categoriesWithAll.map(({ name, _id, href }, idx) => {
                const active = _id === "all" ? !category || category === "all" : category === _id;
                return (
                  <Link
                    {...(categoriesWithAll.length - 1 === idx ? { ref: endRef } : {})}
                    to={href}
                    key={_id}
                    className={cn("p-2 rounded-full min-w-16", active ? "bg-primary text-white" : "bg-transparent border text-primary border-primary")}
                  >
                    <p className="text-xs text-center truncate">{name}</p>
                  </Link>
                );
              })}
            </>
          )}
          {isFetchingNextCatPage && <Loader2 className="animate-spin size-6" />}
        </div>
      </div>
    </div>
  );
};

export default CategoriesTabs;
