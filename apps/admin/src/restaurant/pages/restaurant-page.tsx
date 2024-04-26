import { Separator } from "@ui/components";
import {
  OpeningHourseTable,
  RestaurantHeader,
} from "@src/restaurant/components/restaurant";
import useRestaurant from "@src/restaurant/hooks/use-restaurant";

const RestaurantPage = () => {
  const { data, isFetching } = useRestaurant();

  return (
    <>
      <RestaurantHeader restaurant={data} isFetching={isFetching} />
      <Separator className="my-4" />
      <OpeningHourseTable day={data?.openingHours} isFetching={isFetching} />
    </>
  );
};

export default RestaurantPage;
