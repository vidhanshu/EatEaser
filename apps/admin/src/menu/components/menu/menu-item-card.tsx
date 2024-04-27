import { Link } from "react-router-dom";
import { IndianRupee } from "lucide-react";

import { cn } from "@ui/lib/utils";
import { Card, ImgWithPlaceholder, Typography } from "@ui/components";
import KeyVal from "@ui/components/custom/key-val";
import { NSRestaurant } from "@src/types/restaurant.type";

export const MenuItemCard = ({ menu }: { menu: NSRestaurant.IMenuItem }) => {
  return (
    <Link to={`/menu/view/${menu._id}`}>
      <Card className="p-2 space-y-4">
        <ImgWithPlaceholder
          className="w-full"
          src={menu.image}
          placeholder={menu.name}
        />
        <div className="px-2 space-y-4">
          <Typography
            variant="small"
            className="max-w-[200px] h-[20px] text-nowrap overflow-clip"
          >
            {menu.name}
          </Typography>
          <KeyVal
            label={{ label: "Price", icon: IndianRupee }}
            value={menu.price}
          />
          <div className="flex gap-x-2">
            <Typography className="text-sm text-muted-foreground">
              {menu.category?.name}
            </Typography>
            {"."}
            <Typography
              className={cn(
                "text-sm font-medium text-muted-foreground",
                menu.isAvailable ? "text-emerald-600" : "text-rose-500"
              )}
            >
              {menu.isAvailable ? "Available" : "Not Available"}
            </Typography>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default MenuItemCard;
