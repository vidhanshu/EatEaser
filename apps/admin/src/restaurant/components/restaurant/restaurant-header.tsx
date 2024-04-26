import {
  Mail,
  MapPin,
  Phone,
  Pencil,
  Pin,
  Utensils,
  ReceiptText,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@ui/components";
import KeyVal from "@ui/components/custom/key-val";
import { NSRestaurant } from "@src/types/restaurant.type";
import useSidebarStore from "@src/common/stores/sidebar-store";
import ImgWithPlaceholder from "@src/common/components/img-with-placeholder";
import { HeaderSkeleton } from "@src/common/components/skeletons";

export const RestaurantHeader = ({
  restaurant: data,
  isFetching,
}: {
  restaurant?: NSRestaurant.IResturant;
  isFetching: boolean;
}) => {
  const open = useSidebarStore((state) => state.open);

  if (isFetching) {
    return <HeaderSkeleton />;
  }

  const keyValData = [
    {
      label: "Name",
      icon: Utensils,
      value: data?.name,
    },
    {
      label: "Address",
      icon: MapPin,
      value: data?.address,
    },
    {
      label: "Email",
      icon: Mail,
      value: data?.email,
    },
    {
      label: "Phone",
      icon: Phone,
      value: data?.phone,
    },
    {
      label: "Accepts Reservation",
      icon: Pin,
      value: data?.acceptsReservations ? "Yes" : "No",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between">
        <div className="flex gap-x-4 items-center">
          <ImgWithPlaceholder src={data?.image} placeholder={data?.name} />
          <div className="space-y-2">
            {keyValData.map(({ label, icon, value }) => (
              <KeyVal key={label} label={{ label, icon }} value={value} />
            ))}
          </div>
        </div>
        <Link to="/restaurant/edit">
          <Button size="sm" startContent={<Pencil size={16} />}>
            Edit
          </Button>
        </Link>
      </div>
      <KeyVal
        containerProps={{ className: "flex flex-col items-start gap-2" }}
        label={{ label: "Description", icon: ReceiptText }}
        value={data?.description ?? "N/A"}
        valueProps={{
          className: open
            ? "max-w-[calc(100vw-250px-64px)]"
            : "max-w-[calc(100vw-85px-64px)]",
        }}
      />
    </div>
  );
};

export default RestaurantHeader;
