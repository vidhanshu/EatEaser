import { EmptyData } from "@src/common/components/empty-data";
import { GridSkeleton } from "@src/common/components/skeletons";
import { APP_ROUTES } from "@src/common/utils/app-routes";
import { NSRestaurant } from "@src/types/restaurant.type";
import { Card, ImgWithPlaceholder, Typography } from "@ui/components";
import KeyVal from "@ui/components/custom/key-val";
import { IndianRupee, Salad } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const AddOns = ({
  addOns,
  isFetching = false,
}: {
  addOns: NSRestaurant.IMenuItem["addOns"];
  isFetching?: boolean;
}) => {
  const { id } = useParams();
  if (isFetching) {
    return <GridSkeleton length={5} />;
  }
  if (addOns.length === 0)
    return (
      <EmptyData
        placeholder="No Add-ons added!"
        link={`${APP_ROUTES.menuEdit}/?id=${id}`}
      />
    );

  return (
    <div className="space-y-4">
      <Typography variant="h4">Add-ons</Typography>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {addOns.map((addOn) => (
          <Link
            to={`${APP_ROUTES.menuAddOns}?id=${addOn._id}&mode=view`}
            key={addOn._id}
          >
            <Card className="p-2">
              <ImgWithPlaceholder
                className="w-full h-[150px]"
                src={addOn.image}
                placeholder={addOn.name}
              />
              <div className="space-y-2 mt-4">
                <KeyVal
                  labelProps={{ className: "text-md" }}
                  valueProps={{ className: "text-md" }}
                  label={{
                    label: "Name",
                    icon: Salad,
                  }}
                  value={addOn.name}
                />
                <KeyVal
                  labelProps={{ className: "text-md" }}
                  valueProps={{ className: "text-md" }}
                  label={{
                    label: "Price",
                    icon: IndianRupee,
                  }}
                  value={addOn.price}
                />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AddOns;
