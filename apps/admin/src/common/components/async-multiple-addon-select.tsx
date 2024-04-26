/**
 * @author Vidhanshu Borade
 *
 * This component is used to select multiple add-ons from the database,
 * it uses the useAddOns hook to fetch the add-ons from the database
 */

import { useMemo, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
  ButtonProps,
  Input,
  InputProps,
  Typography,
  ScrollArea,
} from "@ui/components";
import { cn } from "@ui/lib/utils";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { useDebounceValue } from "usehooks-ts";
import useAddOns from "@src/menu/hooks/use-add-ons";

const AsyncMultipleAddonSelect = ({
  buttonProps: { className: btnClass, ...restBtnProps } = {},
  inputProps: { className: inpClass, ...restInpProps } = {},
  value,
  setValue,
  placeholder = "Select",
  allowFirstFetch = false,
}: {
  inputProps?: InputProps;
  buttonProps?: ButtonProps;
  value: { id: string; name: string }[];
  setValue: (value: { id: string; name: string }[]) => void;
  placeholder?: string;
  allowFirstFetch: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useDebounceValue("", 1000);
  const { addOns, isFetchingAddOns } = useAddOns({
    fetchAddOns: allowFirstFetch,
    variables: { filters: { q } },
  });

  const options = useMemo(() => {
    return (
      addOns?.result?.map((cat) => ({
        label: cat.name,
        value: cat._id,
      })) ?? []
    );
  }, [addOns]);

  const showScroll = options.length > 7;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          containerProps={{
            className: "flex-grow max-w-full overflow-x-auto no-scrollbar",
          }}
          className={cn(
            "w-full font-normal hover:bg-white dark:hover:bg-black",
            btnClass
          )}
          {...restBtnProps}
        >
          <div className="flex items-center justify-between flex-grow">
            <div className="flex gap-x-2">
              {value.length > 0
                ? value.map((label) => {
                    return (
                      <div
                        key={label.name}
                        className="rounded-full border px-2 py-1 text-xs flex gap-x-1 items-center"
                      >
                        {label.name}
                      </div>
                    );
                  })
                : placeholder}
            </div>
            <ChevronsUpDown size={16} />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-2" align="start" side="bottom">
        <Input
          startIcon={Search}
          placeholder="Search for add-ons"
          onChange={(e) => setQ(e.target.value)}
          className={cn("py-0 text-sm h-8 rounded-sm", inpClass)}
          {...restInpProps}
        />
        <ScrollArea className={cn("mt-2", showScroll ? "h-[200px]" : "")}>
          <ul className={cn("space-y-1 mt-2", showScroll ? "pr-3" : "")}>
            {!q && !options.length ? (
              <Typography variant="muted" className="text-center">
                Start typing to search categories
              </Typography>
            ) : isFetchingAddOns ? (
              <Typography variant="muted" className="text-center">
                Loading...
              </Typography>
            ) : options.length === 0 ? (
              <Typography variant="muted" className="text-center">
                No result found
              </Typography>
            ) : (
              options.map((opt) => {
                const existsAlready = value.find((val) => val.id === opt.value);
                return (
                  <li
                    key={opt.value}
                    onClick={() => {
                      if (existsAlready)
                        setValue(value.filter((val) => val.id !== opt.value));
                      else
                        setValue([
                          ...value,
                          {
                            id: opt.value,
                            name: opt.label,
                          },
                        ]);
                    }}
                    className="flex justify-between cursor-pointer text-sm pl-4 pr-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-sm"
                  >
                    {/* highlight the part of the text if there is query q */}
                    {q ? (
                      <span
                        dangerouslySetInnerHTML={{
                          __html: opt.label.replace(
                            new RegExp(q, "gi"),
                            (match) =>
                              `<span style="text-decoration:underline;">${match}</span>`
                          ),
                        }}
                      />
                    ) : (
                      opt.label
                    )}
                    {existsAlready && <Check size={16} />}
                  </li>
                );
              })
            )}
          </ul>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default AsyncMultipleAddonSelect;
