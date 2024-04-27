/**
 * @author Vidhanshu Borade
 *
 * This field allow user to search for categories in the database that are available to select
 */

import useCategory from "@src/menu/hooks/use-categories";
import { Button, ButtonProps, Input, InputProps, Popover, PopoverContent, PopoverTrigger, ScrollArea, Typography } from "@repo/ui";
import { cn } from "@ui/lib/utils";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDebounceValue } from "usehooks-ts";

//--------------------------------------------------------------------------------------------

interface AsyncCategorySelectProps {
  inputProps?: InputProps;
  buttonProps?: ButtonProps;
  value?: { id: string; name: string };
  setValue: (value: { id: string; name: string }) => void;
  placeholder?: string;
  allowFirstFetch?: boolean;
  size?: "sm" | "md" | "lg";
}

//--------------------------------------------------------------------------------------------

const AsyncCategorySelect = ({
  value,
  setValue,
  size = "md",
  buttonProps: { className: btnClass, ...restBtnProps } = {},
  inputProps: { className: inpClass, ...restInpProps } = {},
  placeholder = "Select",
  allowFirstFetch = false,
}: AsyncCategorySelectProps) => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useDebounceValue("", 1000);
  const { categories, isFetchingCategories, getCategories } = useCategory({
    fetchCategories: allowFirstFetch,
    variables: { filters: { q } },
  });

  useEffect(() => {
    if (q) {
      getCategories();
    }
  }, [q]);

  const options = useMemo(() => {
    return (
      categories?.result?.map((cat) => ({
        label: cat.name,
        value: cat._id,
      })) ?? []
    );
  }, [categories]);

  const textSizeClass = size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base";

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size={size === "md" ? "sm" : size == "sm" ? "xs" : "default"}
            containerProps={{ className: "flex-grow" }}
            className={cn("w-full font-normal hover:bg-white dark:hover:bg-black", btnClass)}
            {...restBtnProps}
          >
            <div className="flex items-center justify-between flex-grow">
              {value?.name || placeholder}
              <ChevronsUpDown size={16} />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-2" align="start" side="bottom">
          <Input
            sizeVariant={size}
            startIcon={Search}
            placeholder="Search for category"
            onChange={(e) => setQ(e.target.value)}
            className={cn("py-0 text-sm h-8 rounded-sm", inpClass)}
            {...restInpProps}
          />
          <ScrollArea className={cn("mt-2", options.length > 7 ? "h-[200px]" : "")}>
            <ul className="space-y-1 mt-2">
              {!q && !options.length ? (
                <Typography variant="muted" className={cn("text-center", textSizeClass)}>
                  Start typing to search categories
                </Typography>
              ) : isFetchingCategories ? (
                <Typography variant="muted" className={cn("text-center", textSizeClass)}>
                  Loading...
                </Typography>
              ) : options.length === 0 ? (
                <Typography variant="muted" className={cn("text-center", textSizeClass)}>
                  No result found
                </Typography>
              ) : (
                options.map((opt) => (
                  <li
                    onClick={() => {
                      if (value?.id !== opt.value)
                        setValue({
                          id: opt.value,
                          name: opt.label,
                        });
                      else
                        setValue({
                          id: "",
                          name: "",
                        });
                      setOpen(false);
                    }}
                    className={cn("flex justify-between cursor-pointer text-sm pl-4 pr-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-sm", textSizeClass)}
                    key={opt.value}
                  >
                    {/* highlight the part of the text if there is query q */}
                    {q ? (
                      <span
                        dangerouslySetInnerHTML={{
                          __html: opt.label.replace(new RegExp(q, "gi"), (match) => `<span style="text-decoration:underline;">${match}</span>`),
                        }}
                      />
                    ) : (
                      opt.label
                    )}
                    {value?.id === opt.value && <Check size={16} />}
                  </li>
                ))
              )}
            </ul>
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AsyncCategorySelect;
