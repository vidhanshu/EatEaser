import { Typography } from "@ui/components";
import { NSRestaurant } from "@src/types/restaurant.type";
import KeyVal from "@ui/components/custom/key-val";
import { KeyValSkeleton } from "@src/common/components/skeletons";
import { EmptyData } from "@src/common/components/empty-data";
import { APP_ROUTES } from "@src/common/utils/app-routes";
import { useParams } from "react-router-dom";

const MenuMoreInfo = ({
  moreInfo,
  isFetching = false,
}: {
  moreInfo: NSRestaurant.IMenuItem["moreInfo"];
  isFetching?: boolean;
}) => {
  const { id } = useParams();
  const data = moreInfo.map(({ label, value }) => ({
    label: { label },
    value,
  }));

  if (isFetching) {
    return <KeyValSkeleton />;
  }

  if (moreInfo.length === 0) {
    return (
      <EmptyData
        placeholder="No More info added!"
        link={`${APP_ROUTES.menuEdit}/?id=${id}`}
      />
    );
  }

  return (
    <div className="space-y-4">
      <Typography variant="h4">More Info</Typography>
      <div className="space-y-4">
        {data.map((info) => (
          <KeyVal key={info.value} {...info} />
        ))}
      </div>
    </div>
  );
};

export default MenuMoreInfo;
