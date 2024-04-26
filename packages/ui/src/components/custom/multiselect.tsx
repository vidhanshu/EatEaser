/**
 * @author Vidhanshu Borade
 *
 * Custom Multiselect component
 * @param {InputProps} inputProps - Input props
 * @param {ButtonProps} buttonProps - Button props
 * @param {string} value - Value of the input
 * @param {function} setValue - Function to set value
 * @param {string} placeholder - Placeholder for the input
 * @param {Array} options - Options for the Multiselect
 * @returns {ReactElement}
 */

import { useState } from "react";
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
} from "..";
import { cn } from "@ui/lib/utils";
import { Check, ChevronsUpDown, Search } from "lucide-react";

export const Multiselect = ({
  buttonProps: { className: btnClass, ...restBtnProps } = {},
  inputProps: { className: inpClass, ...restInpProps } = {},
  value,
  setValue,
  placeholder = "Select",
  options,
}: {
  inputProps?: InputProps;
  buttonProps?: ButtonProps;
  value: string[];
  setValue: (value: string[]) => void;
  placeholder?: string;
  options: {
    label: string;
    value: string;
  }[];
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOpt = search
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase())
      )
    : options;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          containerProps={{ className: "flex-grow" }}
          className={cn(
            "w-full font-normal hover:bg-white dark:hover:bg-black",
            btnClass
          )}
          {...restBtnProps}
        >
          <div className="flex items-center justify-between flex-grow">
            <div className="flex gap-x-2">
              {value.length > 0
                ? value
                    .map(
                      (val) => options.find((opt) => opt.value === val)?.label
                    )
                    .map((label) => {
                      return (
                        <div
                          key={label}
                          className="rounded-full border px-2 py-1 text-xs flex gap-x-1 items-center"
                        >
                          {label}
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
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={cn("py-0 text-sm h-8 rounded-sm", inpClass)}
          {...restInpProps}
        />
        <ScrollArea
          className={cn("mt-2", options.length > 7 ? "h-[200px]" : "")}
        >
          <ul className="space-y-1">
            {filteredOpt.length === 0 && (
              <Typography variant="muted" className="text-center">
                No result found
              </Typography>
            )}
            {filteredOpt.map((opt) => (
              <li
                key={opt.value}
                onClick={() => {
                  if (value.includes(opt.value))
                    setValue(value.filter((val) => val !== opt.value));
                  else setValue([...value, opt.value]);
                }}
                className="flex justify-between cursor-pointer text-sm pl-4 pr-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-sm"
              >
                {opt.label}
                {value.includes(opt.value) && <Check size={16} />}
              </li>
            ))}
          </ul>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
