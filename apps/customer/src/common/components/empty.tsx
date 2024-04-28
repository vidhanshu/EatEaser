import { PropsWithChildren } from "react";

import { Typography } from "@repo/ui";

const Empty = ({
  children,
  notFoundTitle = "Not Found",
  notFoundDescription = "Sorry, no food items found for this category",
}: { notFoundTitle?: string; notFoundDescription?: string } & PropsWithChildren) => {
  return (
    <div className="flex flex-col gap-4 mt-4">
      <img className="w-60 mx-auto h-auto" src="/not-found-food.svg" />
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
