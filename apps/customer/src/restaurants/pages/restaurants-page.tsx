import { NSRestaurant } from "@src/common/types/restaurant.type";
import { ROUTES } from "@src/common/utils/api-routes";
import axiosInstance from "@src/common/utils/axios";
import { useQuery } from "@tanstack/react-query";
import { Button, ImgWithPlaceholder, Typography } from "@repo/ui";
import { ArrowDown, ArrowRight, Info } from "lucide-react";
import { Link } from "react-router-dom";

const RestaurantsPage = () => {
  const { data: { result = [] } = {} } = useQuery({
    queryKey: ["restaurants"],
    queryFn: async () => (await axiosInstance.get(ROUTES.restaurant.list)).data?.data as NSCommon.IListRespone<NSRestaurant.IResturant>["data"],
  });

  return (
    <main className="pt-8 px-4">
      <div className="h-[calc(100vh-200px)] flex flex-col items-center justify-center">
        <img src="/logo.svg" className="mx-auto size-16" />
        <h1 className="text-4xl font-semibold text-center text-primary">Welcome to EatEaser!</h1>
        <p className="text-center mt-4">Making your food ordering experience easier and faster!</p>
        <div className="flex justify-center py-4">
          <a href="#choose">
            <Button size="sm" className="text-white" endContent={<ArrowDown size={16} />}>
              Explore now!
            </Button>
          </a>
        </div>
        <div id="choose" />
      </div>

      <div className="pt-10 space-y-4">
        <Typography className="text-center" variant="h4">
          Choose the restaurant You are in
        </Typography>
        <div className="space-y-4">
          {result.map((restaurant, idx) => (
            <div key={idx} className="bg-input rounded-md p-4">
              <ImgWithPlaceholder className="w-full" placeholder={restaurant.name} src={restaurant.image} />
              <div className="py-4 space-y-4">
                <Typography variant="h5">{restaurant.name}</Typography>
                <Typography className="max-h-[83px] truncate whitespace-pre-wrap" variant="muted">
                  {restaurant.description?.substring(0, 155)}...
                </Typography>
              </div>
              <div className="flex justify-between items-center">
                <Link to={`/restaurants/${restaurant._id}`}>
                  <Button
                    variant="outline"
                    className="dark:bg-transparent border border-gray-200 bg-white dark:border-gray-800 hover:dark:bg-transparent"
                    startContent={<Info size={16} />}
                  >
                    About restaurant
                  </Button>
                </Link>
                <Link to={`/#top?rid=${restaurant._id}`}>
                  <Button size="sm" className="text-white" endContent={<ArrowRight size={16} />}>
                    View Menu
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default RestaurantsPage;