import { useNavigate } from "react-router-dom";

import { NSRestaurant } from "@src/types/restaurant.type";
import { TableStatusBadge, getClassNameByStatus } from ".";
import { cn } from "@ui/lib/utils";
import { Button, Typography } from "@ui/components";
import { Eye, Pencil, Trash2 } from "lucide-react";
import GenericAlertDialog from "@ui/components/custom/generic-alert-dialog";
import { APP_ROUTES } from "@src/common/utils/app-routes";

export const TableCard = ({
  _id,
  name,
  capacity,
  status,
  handleDelete,
  loading = false,
}: {
  _id: string;
  name: string;
  capacity: number;
  status: NSRestaurant.TABLE_STATUS;
  handleDelete: (_id: string) => void;
  loading?: boolean;
}) => {
  const navigate = useNavigate();

  return (
    <div
      key={_id}
      className={cn(
        "border-2 rounded-md flex min-w-[160px] h-[160px] items-center justify-center",
        getClassNameByStatus(status, true)
      )}
    >
      <div className="space-y-3">
        <Typography className="text-center" variant="h4">
          {name}
        </Typography>
        <Typography className="text-center" variant="muted">
          Capacity: {capacity}
        </Typography>
        <TableStatusBadge status={status} />
        <div className="flex flex-grow justify-between gap-x-4">
          <Button
            loading={loading}
            variant="outline"
            size="icon-sm"
            startContent={<Eye size={16} />}
            onClick={() => {
              navigate(`${APP_ROUTES.restaurantTables}?id=${_id}&mode=view`);
            }}
          />
          <Button
            onClick={() => {
              navigate(`${APP_ROUTES.restaurantTables}?id=${_id}&mode=edit`);
            }}
            loading={loading}
            size="icon-sm"
            startContent={<Pencil size={16} />}
          />
          <GenericAlertDialog onOk={() => handleDelete(_id)}>
            <Button
              size="icon-sm"
              variant="destructive"
              loading={loading}
              startContent={<Trash2 size={16} />}
            />
          </GenericAlertDialog>
        </div>
      </div>
    </div>
  );
};
