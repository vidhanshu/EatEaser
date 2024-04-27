import { Link, useSearchParams } from "react-router-dom";

import { useMemo, useState } from "react";
import { CheckCircle, SlidersHorizontal, Undo2 } from "lucide-react";

import { cn } from "@ui/lib/utils";
import { NSRestaurant } from "@src/common/types/restaurant.type";
import AsyncCategorySelect from "@src/common/components/async-category-selector";
import { Button, Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger, Label, RadioGroup, RadioGroupItem, Typography } from "@repo/ui";

const CategoriesTabs = ({ categories, isLoading }: { categories: NSRestaurant.ICategory[]; isLoading: Boolean }) => {
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
        <div className="flex w-max space-x-4">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => <div key={i} className="animate-pulse bg-gray-200 w-[64px] h-[33.5px] rounded-full" />)
          ) : (
            <>
              <FilterDialog />
              {categoriesWithAll.map(({ name, _id, href }) => {
                const active = _id === "all" ? !category || category === "all" : category === _id;
                return (
                  <Link to={href} key={_id} className={cn("p-2 rounded-full min-w-16", active ? "bg-emerald-500 text-white" : "bg-white border")}>
                    <p className="text-xs text-center truncate">{name}</p>
                  </Link>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoriesTabs;

interface IFilter {
  category?: {
    id: string;
    name: string;
  };
  isVegetarian?: string;
  isAvailable?: string;
  sortBy?: string;
}
export const FilterDialog = () => {
  const [_, ssp] = useSearchParams();
  const [filters, setFilters] = useState<IFilter>({});

  const applyFilters = () => {
    const { category, isAvailable, isVegetarian, sortBy } = filters;
    const params: Record<string, string> = {};
    if (category?.id) params["category"] = category.id;
    const isAv = isAvailable === "yes" ? true : isAvailable === "no" ? false : undefined;
    if (isAv !== undefined) params["isAvailable"] = isAv.toString();
    const isVeg = isVegetarian === "yes" ? true : isVegetarian === "no" ? false : undefined;
    if (isVeg !== undefined) params["isVegetarian"] = isVeg.toString();
    params["sortBy"] = sortBy ? sortBy : "default";
    if (Object.keys(params).length) ssp(params);
  };

  const onReset = () => ssp({});

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className={cn("p-2 rounded-full min-w-16 bg-white border")}>
          <SlidersHorizontal className="mx-auto text-gray-600" size={16} />
        </button>
      </DialogTrigger>
      <DialogContent className="border rounded-md max-w-[95vw] p-4">
        <div>
          <Typography variant="h4">Apply filters</Typography>
          <Typography variant="muted">Get more specific results for your delicious dish by applying filters</Typography>
          <div className="space-y-4 py-4">
            <div>
              <Typography variant="muted" className="mb-2">
                Filter by category
              </Typography>
              <AsyncCategorySelect allowFirstFetch value={filters.category} placeholder="Select category" setValue={(category) => setFilters((prev) => ({ ...prev, category }))} />
            </div>
            <div>
              <Typography variant="muted">Filter by Availability</Typography>
              <RadioGroup
                value={filters.isAvailable}
                onValueChange={(isAvailable) => setFilters((prev) => ({ ...prev, isAvailable }))}
                className="flex gap-x-4 mt-2"
                defaultValue="default"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="default" id="avl1" />
                  <Label htmlFor="avl1">Default</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="avl2" />
                  <Label htmlFor="avl2">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="avl3" />
                  <Label htmlFor="avl3">No</Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <Typography variant="muted">Filter by Dietary Preference</Typography>
              <RadioGroup
                value={filters.isVegetarian}
                onValueChange={(isVegetarian) => setFilters((prev) => ({ ...prev, isVegetarian }))}
                className="flex gap-x-4 mt-2"
                defaultValue="default"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="default" id="veg1" />
                  <Label htmlFor="veg1">Default</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="veg2" />
                  <Label htmlFor="veg2">Veg</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="veg3" />
                  <Label htmlFor="veg3">Non-Veg</Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <Typography variant="muted">Sort by</Typography>
              <RadioGroup value={filters.sortBy} onValueChange={(sortBy) => setFilters((prev) => ({ ...prev, sortBy }))} className="flex gap-x-4 mt-2" defaultValue="default">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="default" id="sort1" />
                  <Label htmlFor="sort1">Default</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="price" id="sort2" />
                  <Label htmlFor="sort2">Price</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="popularity" id="sort3" />
                  <Label htmlFor="sort3">Popularity</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
        <DialogFooter>
          <div className="flex gap-x-4">
            <DialogClose asChild onClick={applyFilters} className="flex-1">
              <Button className="w-full" size="sm" endContent={<CheckCircle size={16} />}>
                Apply
              </Button>
            </DialogClose>
            <DialogClose asChild onClick={onReset} className="flex-1">
              <Button className="w-full" variant="outline" size="sm" endContent={<Undo2 size={16} />}>
                Reset
              </Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
