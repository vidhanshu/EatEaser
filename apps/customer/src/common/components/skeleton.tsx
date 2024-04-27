import { cn } from "@ui/lib/utils";

const CSkeleton = ({ className }: { className?: string }) => {
  return <div className={cn("animate-pulse bg-gray-200 dark:bg-[#1f222a]", className)} />;
};

export default CSkeleton;
