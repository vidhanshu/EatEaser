import { PRICES } from "@src/menu/utils/constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui";
import { useMemo } from "react";

const MinMaxPriceInput = ({
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  showLabel = true,
}: {
  minPrice?: string;
  maxPrice?: string;
  setMinPrice: (val: string) => void;
  setMaxPrice: (val: string) => void;
  showLabel?: boolean;
}) => {
  const minPriceOptions = useMemo(() => {
    return PRICES.filter((price) => (maxPrice ? Number(price) < Number(maxPrice) : true));
  }, [maxPrice]);

  const maxPriceOptions = useMemo(() => {
    return PRICES.filter((price) => (minPrice ? Number(price) > Number(minPrice) : true));
  }, [minPrice]);

  return (
    <div className="grid grid-cols-2 gap-x-4">
      <label>
        {showLabel && <span className="text-xs text-muted-foreground">min. price</span>}
        <Select
          value={minPrice}
          onValueChange={(val) => {
            setMinPrice(val);
          }}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="min. price" />
          </SelectTrigger>
          <SelectContent className="max-h-[200px]">
            {minPriceOptions.map((price) => (
              <SelectItem className="text-xs" key={price} value={price}>
                {price}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </label>
      <label>
        {showLabel && <span className="text-xs text-muted-foreground">max. price</span>}
        <Select
          value={maxPrice}
          onValueChange={(val) => {
            setMaxPrice(val);
          }}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="max. price" />
          </SelectTrigger>
          <SelectContent className="max-h-[200px]">
            {maxPriceOptions.map((price) => (
              <SelectItem className="text-xs" key={price} value={price}>
                {price}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </label>
    </div>
  );
};

export default MinMaxPriceInput;
