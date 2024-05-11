import { NSRestaurant } from "@src/common/types/restaurant.type";
import { cn } from "@ui/lib/utils";

export const getClassNameByStatus = (status: NSRestaurant.TABLE_STATUS, borderOnly: boolean = false) => {
  switch (status) {
    case "AVAILABLE":
      return borderOnly ? "border-primary bg-primary/5 w-fit" : "border text-xs w-fit mx-auto border-primary px-2 bg-primary/20 rounded-full";
    case "RESERVED":
      return borderOnly ? "border-rose-500 bg-red-300/5 w-fit" : "border text-xs w-fit mx-auto border-rose-500 px-2 bg-rose-500/20 rounded-full";
    case "OCCUPIED":
      return borderOnly ? "border-yellow-500 bg-yellow-300/5 w-fit" : "border text-xs w-fit mx-auto border-yellow-500 px-2 bg-yellow-500/20 rounded-full";
    default:
      return borderOnly ? "border-gray-500 bg-gray-300/5 w-fit" : "border text-xs w-fit mx-auto border-gray-500 px-2 bg-gray-500/20 rounded-full";
  }
};

export const TableStatusBadge = ({ status, className }: { status?: NSRestaurant.TABLE_STATUS; className?: string }) => (
  <div className={cn(status && getClassNameByStatus(status), className)}>{status?.toLowerCase() ?? "NA"}</div>
);
