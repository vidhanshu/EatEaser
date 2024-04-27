import { cn } from "@ui/lib/utils";
import React from "react";
import { Typography } from "..";
import { LucideIcon } from "lucide-react";

export const KeyVal = ({
  containerProps: { className, ...restContainerProps } = {},
  labelProps: { className: labelClassName, ...restLabelProps } = {},
  valueProps: { className: valueClassName, ...restValueProps } = {},
  label,
  value,
}: {
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
  labelProps?: React.HTMLAttributes<HTMLDivElement>;
  label: { label: string; icon?: LucideIcon };
  value?: React.ReactNode;
  valueProps?: React.HTMLAttributes<HTMLDivElement>;
}) => {
  const Icon = label.icon;
  return (
    <div
      className={cn("flex gap-x-4 items-center", className)}
      {...restContainerProps}
    >
      <div className="flex gap-x-4 items-center">
        {Icon && <Icon size={16} className="text-muted-foreground" />}
        <Typography
          variant="h5"
          className={cn("font-medium text-lg", labelClassName)}
          {...restLabelProps}
        >
          {label.label}
        </Typography>
      </div>
      <Typography
        className={cn("text-muted-foreground", valueClassName)}
        variant="default"
        {...restValueProps}
      >
        {value ?? "-"}
      </Typography>
    </div>
  );
};

export default KeyVal;
