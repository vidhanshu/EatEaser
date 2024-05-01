import { cn } from "@ui/lib/utils";
import { Button, Typography } from "@ui/components";
import { NSRestaurant } from "@src/common/types/restaurant.type";
import { TableStatusBadge, getClassNameByStatus } from "./status-badge";
import { Ref } from "react";

export const TableCard = ({
  _id,
  name,
  capacity,
  status,
  loading = false,
  onViewClick,
  endRef,
  className,
  selectable = false,
  onClick,
}: {
  _id: string;
  name: string;
  capacity: number;
  loading?: boolean;
  className?: string;
  status: NSRestaurant.TABLE_STATUS;
  onViewClick?: (id: string) => void;
  endRef?: Ref<HTMLDivElement>;
  selectable?: boolean;
  onClick?: () => void;
}) => (
  <div
    key={_id}
    ref={endRef}
    onClick={() => onClick?.()}
    className={cn("border-2 rounded-md flex min-w-[160px] h-[150px] items-center justify-center", getClassNameByStatus(status, true), className, onClick ? "cursor-pointer" : "")}
  >
    <div className="space-y-3 flex flex-col items-center">
      <Typography className="text-center" variant="h4">
        {name}
      </Typography>
      <Typography className="text-center text-xs" variant="muted">
        Capacity: {capacity}
      </Typography>
      <TableStatusBadge status={status} />
      {!selectable && (
        <Button
          size="xs"
          variant={status === "RESERVED" ? "destructive" : "default"}
          className={cn("h-6", status === "OCCUPIED" && "bg-yellow-500 hover:bg-yellow-500 active:bg-yellow-500")}
          loading={loading}
          onClick={() => onViewClick?.(_id)}
        >
          View
        </Button>
      )}
    </div>
  </div>
);
