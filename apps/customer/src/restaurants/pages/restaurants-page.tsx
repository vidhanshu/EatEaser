import { Button, ImgWithPlaceholder, Input, Typography } from "@ui/components";
import { ArrowDown, ArrowRight, Info, Search } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import useInfinte from "@src/common/hooks/use-infinite";
import { PAGES, RestaurantDetailsPage } from "@src/common/utils/pages";
import PageMeta from "@src/common/components/page-meta";
import { useDebounceValue } from "usehooks-ts";
import { restaurantService } from "../services/restaurant";
import Empty from "@src/common/components/empty";
import CSkeleton from "@src/common/components/skeleton";

const RestaurantsPage = () => {
  const [sp, ssp] = useSearchParams();
  const sq = sp.get("q") ?? "";
  const [q, setQ] = useDebounceValue("", 1000);

  const { data, isLoading } = useInfinte({
    fetcher: restaurantService.getRestaurantsList,
    queryKey: ["restaurants"],
    filters: { q },
  });

  return (
    <main className="pt-8 px-4">
      <PageMeta title={PAGES.RestaurantsPage.title} description={PAGES.RestaurantsPage.description} />
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
        <div>
          <Input
            value={sq}
            type="search"
            onChange={(e) => {
              setQ(e.target.value);
              ssp({ q: e.target.value });
            }}
            startIcon={Search}
            className="bg-input rounded-full"
            placeholder="Search for a restaurat"
          />
        </div>
        <div className="space-y-4">
          {isLoading ? (
            <CSkeleton className="h-[300px] w-full rounded-md" />
          ) : q?.length && !data.length ? (
            <Empty className="min-h-[300px]" notFoundDescription={`Sorry, no result found for "${q}"`} />
          ) : data.length === 0 ? (
            <Empty className="min-h-[300px]" notFoundDescription="Sory no restaurants found in the system!" />
          ) : (
            data.map((restaurant, idx) => (
              <div key={idx} className="bg-input rounded-md p-4">
                <ImgWithPlaceholder className="w-full" placeholder={restaurant.name} src={restaurant.image} />
                <div className="py-4 space-y-4">
                  <Typography variant="h5">{restaurant.name}</Typography>
                  <Typography className="max-h-[83px] truncate whitespace-pre-wrap" variant="muted">
                    {restaurant.description?.substring(0, 155)}...
                  </Typography>
                </div>
                <div className="flex justify-between items-center">
                  <Link to={RestaurantDetailsPage(restaurant._id).href}>
                    <Button
                      variant="outline"
                      className="dark:bg-transparent border border-gray-200 bg-white dark:border-gray-800 hover:dark:bg-transparent"
                      startContent={<Info size={16} />}
                    >
                      Details
                    </Button>
                  </Link>
                  <Link to={`/?restaurantId=${restaurant._id}`}>
                    <Button size="sm" className="text-white" endContent={<ArrowRight size={16} />}>
                      View Menu
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
};

export default RestaurantsPage;
