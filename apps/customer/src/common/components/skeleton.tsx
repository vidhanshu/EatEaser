import { cn } from "@ui/lib/utils";
import React from "react";

const CSkeleton = ({ className, as = "div" }: { className?: string; as?: React.ElementType }) => {
  const As = as;
  return <As className={cn("animate-pulse bg-gray-200 dark:bg-input", className)} />;
};

export default CSkeleton;
