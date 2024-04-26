import { Link } from "react-router-dom";
import { Plus, Ratio } from "lucide-react";
import { Button, Typography } from "@ui/components";

import { CreateTableForm } from ".";
import { APP_ROUTES } from "@src/common/utils/app-routes";
import GenericUrlCruDialog from "@src/common/components/generic-url-cru-dialog";
import { NSRestaurant } from "@src/types/restaurant.type";

export const NoTablesFound = ({
  placeholder = "No Tables found!",
  status = "AVAILABLE",
}: {
  placeholder?: string;
  status?: NSRestaurant.TABLE_STATUS;
}) => {
  return (
    <div className="flex items-center flex-col gap-4 justify-center">
      <Ratio className="text-muted-foreground" size={30} />
      <Typography className="text-muted-foreground" variant="h4">
        {placeholder}
      </Typography>
      <GenericUrlCruDialog onCloseNavigateTo={APP_ROUTES.restaurantTables}>
        {(mode, id) => <CreateTableForm mode={mode} id={id} />}
      </GenericUrlCruDialog>
      <Link to={`${APP_ROUTES.restaurantTables}?mode=create&status=${status}`}>
        <Button startContent={<Plus size={16} />}>Create Now</Button>
      </Link>
    </div>
  );
};
