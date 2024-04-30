import { PropsWithChildren } from "react";

import { Typography, useTheme } from "@repo/ui";
import { cn } from "@ui/lib/utils";

const Empty = ({
  children,
  notFoundTitle = "Not Found",
  notFoundDescription = "Sorry, no food items found for this category",
  className,
}: { notFoundTitle?: string; notFoundDescription?: string; className?: string } & PropsWithChildren) => {
  const { theme } = useTheme();
  return (
    <div className={cn("flex flex-col gap-4 mt-4", className)}>
      <img className="w-60 mx-auto h-auto" src={theme === "light" ? "/not-found-food.svg" : "/not-found-food-dark.svg"} />
      <div className="space-y-2">
        <Typography className="text-center" variant="h4">
          {notFoundTitle}
        </Typography>
        <Typography className="text-center" variant="muted">
          {notFoundDescription}
        </Typography>
      </div>
      {children}
    </div>
  );
};

export default Empty;
