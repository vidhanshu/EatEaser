import { CheckCircle, SlidersHorizontal, Undo2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import AsyncCategorySelect from "@src/common/components/async-category-selector";
import MinMaxPriceInput from "@src/common/components/min-max-price-input";
import useCategory from "@src/menu/hooks/use-categories";
import { Button, Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger, Label, RadioGroup, RadioGroupItem, Typography } from "@ui/components";
import { cn } from "@ui/lib/utils";

interface IFilter {
  category?: {
    id: string;
    name: string;
  };
  isVegetarian?: string;
  isAvailable?: string;
  sortBy?: string;
  minPrice?: string;
  maxPrice?: string;
}
export const FilterDialog = () => {
  const [sp, ssp] = useSearchParams();
  const [filters, setFilters] = useState<IFilter>({});
  const category = sp.get("category") ?? undefined;
  const { category: cat, getCategory } = useCategory({ fetchCategories: false, variables: { categoryId: category } });

  const isAvailable = sp.get("isAvailable") ?? undefined;
  const isVegetarian = sp.get("isVegetarian") ?? undefined;
  const minPrice = sp.get("minPrice") ?? undefined;
  const maxPrice = sp.get("maxPrice") ?? undefined;
  const sortBy = sp.get("sortBy") ?? undefined;

  const applyFilters = () => {
    const { category, isAvailable, isVegetarian, sortBy, minPrice, maxPrice } = filters;
    const params: Record<string, string> = {};
    if (category?.id) params["category"] = category.id;
    const isAv = isAvailable === "yes" ? true : isAvailable === "no" ? false : undefined;
    if (isAv !== undefined) params["isAvailable"] = isAv.toString();
    const isVeg = isVegetarian === "yes" ? true : isVegetarian === "no" ? false : undefined;
    if (isVeg !== undefined) params["isVegetarian"] = isVeg.toString();
    const sb = sortBy === "default" ? undefined : sortBy;
    if (sb !== undefined) params["sortBy"] = sb;
    if (minPrice) params["minPrice"] = minPrice;
    if (maxPrice) params["maxPrice"] = maxPrice;
    ssp(params);
  };

  const onReset = () => ssp({});

  useEffect(() => {
    if (category && category !== "all") getCategory();
  }, [category]);

  useEffect(() => {
    const filters: IFilter = {};
    if (isAvailable !== undefined) filters["isAvailable"] = isAvailable === "true" ? "yes" : "no";
    if (isVegetarian !== undefined) filters["isVegetarian"] = isVegetarian === "true" ? "yes" : "no";
    if (sortBy !== undefined) filters["sortBy"] = sortBy ? "price" : "popularity";
    if (category === "all") delete filters.category;
    if (category !== undefined && cat) filters["category"] = { id: cat._id, name: cat.name };
    if (minPrice) filters["minPrice"] = minPrice;
    if (maxPrice) filters["maxPrice"] = maxPrice;

    setFilters(filters);
  }, [isAvailable, isVegetarian, minPrice, maxPrice, category, cat, sortBy]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className={cn("p-2 rounded-full min-w-16 bg-transparent border border-primary")}>
          <SlidersHorizontal className="mx-auto text-primary" size={16} />
        </button>
      </DialogTrigger>
      <DialogContent className="dark:bg-background border border-input rounded-md max-w-[95vw] w-fit p-4">
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
            <div>
              <Typography className="mb-2" variant="muted">
                Filter by price range
              </Typography>
              <MinMaxPriceInput
                showLabel={false}
                minPrice={filters.minPrice}
                maxPrice={filters.maxPrice}
                setMinPrice={(minPrice) => setFilters((prev) => ({ ...prev, minPrice }))}
                setMaxPrice={(maxPrice) => setFilters((prev) => ({ ...prev, maxPrice }))}
              />
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
