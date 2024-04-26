import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { ListRestart, Plus, Search, SlidersHorizontal } from "lucide-react";

import {
  Button,
  Checkbox,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ui/components";
import { MenuItemCard } from "@src/menu/components/menu";
import useMenu, { IMenuFilters } from "@src/menu/hooks/use-menu";
import { GridSkeleton } from "@src/common/components/skeletons";
import { EmptyData } from "@src/common/components/empty-data";
import { APP_ROUTES } from "@src/common/utils/app-routes";
import CustomPagination from "@ui/components/custom/custom-pagination";
import MinMaxPriceInput from "@src/menu/components/menu/min-max-price-input";
import AsyncCategorySelect from "@src/common/components/async-category-select";

const checkBoxOptions = ["isAvailable", "isVegan", "isVegetarian"];
const MenuPage = () => {
  const [q, setQ] = useDebounceValue("", 500);
  const [cat, setCat] = useState<{ id: string; name: string } | undefined>(
    undefined
  );
  const [filters, setFilters] = useState<IMenuFilters>({});
  const { menuItems, isFetchingMenuItems } = useMenu({
    variables: { filters },
  });
  const { result = [], totalPages } = menuItems ?? {};

  useEffect(() => {
    if (q) {
      setFilters((prev) => ({ ...prev, q }));
    } else if (q === "") {
      setFilters((prev) => ({ ...prev, q: undefined }));
    }
  }, [q]);

  const isFilterExists = Object.values(filters).some((val) => {
    // TODO: exclude page from filter
    if (val === 1) return false;
    return !!val;
  });

  const handleReset = async () => {
    setFilters({});
    setCat(undefined);
  };

  return (
    <div className="min-h-[calc(100vh-250px)] flex flex-col justify-between">
      {
        <div>
          <div className="flex justify-between pb-4">
            <div className="flex items-center gap-x-2">
              <Input
                sizeVariant="sm"
                startIcon={Search}
                placeholder="Search Menu"
                onChange={(e) => setQ(e.target.value)}
                containerProps={{ className: "w-[200px]" }}
              />
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    size="sm"
                    startContent={<SlidersHorizontal size={16} />}
                  />
                </PopoverTrigger>
                <PopoverContent
                  className="w-[250px] px-4 py-2 space-y-2"
                  align="start"
                  side="bottom"
                >
                  {checkBoxOptions.map((opt, index) => (
                    <div key={opt} className="flex gap-x-2 items-center">
                      <Checkbox
                        id={`s_a_o_${index}`}
                        checked={!!filters[opt as keyof IMenuFilters]}
                        onCheckedChange={() =>
                          setFilters((prev) => ({
                            ...prev,
                            page: 1,
                            [opt]: !prev[opt as keyof IMenuFilters]
                              ? true
                              : undefined,
                          }))
                        }
                      />
                      <label
                        className="cursor-pointer text-muted-foreground"
                        htmlFor={`s_a_o_${index}`}
                      >
                        Show {opt.replace("is", "")} only
                      </label>
                    </div>
                  ))}
                  <MinMaxPriceInput
                    minPrice={filters.minPrice}
                    maxPrice={filters.maxPrice}
                    setMinPrice={(val) => {
                      setFilters((prev) => ({
                        ...prev,
                        minPrice: val,
                        page: 1,
                      }));
                    }}
                    setMaxPrice={(val) => {
                      setFilters((prev) => ({
                        ...prev,
                        maxPrice: val,
                        page: 1,
                      }));
                    }}
                  />
                  <AsyncCategorySelect
                    size="sm"
                    value={cat}
                    placeholder="Select Category"
                    setValue={(val) => {
                      setCat(val);
                      setFilters((prev) => ({
                        ...prev,
                        category: val?.id,
                        page: 1,
                      }));
                    }}
                  />
                  {isFilterExists ? (
                    <Button
                      size="xs"
                      className="w-full"
                      onClick={handleReset}
                      startContent={<ListRestart size={16} />}
                    >
                      Reset
                    </Button>
                  ) : null}
                </PopoverContent>
              </Popover>
            </div>

            <Link to={APP_ROUTES.menuEdit}>
              <Button size="sm" startContent={<Plus size={16} />}>
                Add Menu item
              </Button>
            </Link>
          </div>

          {isFetchingMenuItems ? (
            <GridSkeleton />
          ) : result.length === 0 ? (
            <EmptyData placeholder="No Menu items found!" link="/" />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {result.map((menu) => {
                  return <MenuItemCard menu={menu} key={menu._id} />;
                })}
              </div>
            </>
          )}
        </div>
      }
      <CustomPagination
        page={filters.page ?? 1}
        totalPages={totalPages ?? 1}
        setPage={(page: number) => {
          setFilters((prev) => ({
            ...prev,
            page,
          }));
        }}
      />
    </div>
  );
};

export default MenuPage;
