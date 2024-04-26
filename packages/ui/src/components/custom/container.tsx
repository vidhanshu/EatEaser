import { cn } from "@ui/lib/utils";
import React from "react";
import { Typography } from "..";

type TContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  as?: React.ElementType;
  sectionTitle?: string;
  disableFixWidth?: boolean;
};

export const EContainer = ({
  as,
  children,
  className,
  sectionTitle,
  disableFixWidth = false,
  ...props
}: TContainerProps) => {
  const Component = as || "div";

  return (
    <Component
      className={cn(
        !disableFixWidth
          ? "md:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto px-4 lg:px-0"
          : "",
        className
      )}
      {...props}
    >
      {sectionTitle && (
        <Typography className="mb-8" variant="h3">
          {sectionTitle}
        </Typography>
      )}
      {children}
    </Component>
  );
};
