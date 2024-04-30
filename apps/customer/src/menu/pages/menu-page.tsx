import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import React, { useEffect, useMemo, useState } from "react";

import Menu from "@src/menu/components/menu";
import { PROMOTIONAL_CARDS } from "@src/menu/utils/constants";
import { IMenuFilters } from "@src/menu/hooks/use-menu";
import CategoriesTabs from "@src/menu/components/categories-tabs";
import { Button, Typography, Carousel, CarouselContent, CarouselItem, CarouselApi } from "@repo/ui";
import useAuthStore from "@src/common/stores/auth-store";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@src/common/utils/axios";
import { ROUTES } from "@src/common/utils/api-routes";
import CSkeleton from "@src/common/components/skeleton";
import { NSRestaurant } from "@src/common/types/restaurant.type";
import { getGreeting } from "@ui/helpers";
import { categoryService } from "../services/category";
import useInfinte from "@src/common/hooks/use-infinite";
import { menuService } from "../services/menu";
import { PAGES, RestaurantDetailsPage, SearchPage } from "@src/common/utils/pages";
import PageMeta from "@src/common/components/page-meta";

const MenuPage = () => {
  const [sp] = useSearchParams();

  const user = useAuthStore((store) => store.user);
  const restaurantId = localStorage.getItem("restaurantId");

  const category = sp.get("category") ?? undefined;
  const minPrice = sp.get("minPrice") ?? undefined;
  const maxPrice = sp.get("maxPrice") ?? undefined;
  const isAvailable = sp.get("isAvailable") ?? undefined;
  const isVegetarian = sp.get("isVegetarian") ?? undefined;
  const sortBy = sp.get("sortBy") ?? undefined;

  const filters: IMenuFilters = useMemo(() => {
    const cat: IMenuFilters = { category: category === "all" ? undefined : category };
    cat.isAvailable = isAvailable === "true" ? true : isAvailable === "false" ? false : undefined;
    cat.isVegetarian = isVegetarian === "true" ? true : isVegetarian === "false" ? false : undefined;
    cat.minPrice = minPrice;
    cat.maxPrice = maxPrice;
    cat.sortBy = sortBy;
    return cat;
  }, [category, isAvailable, isVegetarian, minPrice, maxPrice, sortBy]);

  const {
    ref: refCat,
    data: categories,
    isLoading: isLoadingCategoriesFirstTime,
    isFetchingNextPage: isFetchingNextCatPage,
  } = useInfinte({ fetcher: categoryService.getCategories, queryKey: ["categories", restaurantId!] });
  const {
    ref: refMenu,
    hasNextPage: hasNextMenuPage,
    data: menuItems,
    isLoading: isLoadingMenuItemsFirstTime,
    isFetchingNextPage: isFetchingNextMenuPage,
  } = useInfinte({ fetcher: menuService.getMenuItems, queryKey: ["menuItems", restaurantId!], filters });

  const { data: restaurant, isLoading } = useQuery({
    queryKey: ["restaurant", restaurantId],
    queryFn: async () => {
      if (restaurantId) return (await axiosInstance.get(ROUTES.restaurant.byId(restaurantId))).data as NSCommon.ApiResponse<NSRestaurant.IResturant>;
    },
  });

  return (
    <div className="px-4 space-y-4 pt-8">
      <PageMeta title={PAGES.MenuPage.title} description={PAGES.MenuPage.description} />
      <div className="pb-4">
        <Typography variant="h4">
          Hello, <span className="text-primary">{user?.name ? user.name : getGreeting()}!</span>
        </Typography>
        <Typography variant="muted" className="flex gap-x-2 items-center text-base">
          Welcome to{" "}
          <span>
            {isLoading ? (
              <CSkeleton as="span" className="w-28 h-4" />
            ) : (
              <Link className="text-sm  underline" to={RestaurantDetailsPage(restaurant?.data?._id!).href}>
                {restaurant?.data?.name}
              </Link>
            )}
          </span>
        </Typography>
      </div>
      <AnimatedSearchButton />
      <PromotionalCards />
      <CategoriesTabs endRef={refCat} categories={categories} isLoading={isLoadingCategoriesFirstTime} isFetchingNextCatPage={isFetchingNextCatPage} />
      <Menu isFetchingNextPage={isFetchingNextMenuPage} hasNextMenuPage={hasNextMenuPage} endRef={refMenu} menuItems={menuItems} isLoading={isLoadingMenuItemsFirstTime} />
    </div>
  );
};

export default MenuPage;

const AnimatedSearchButton = () => {
  const [idx, setIdx] = useState(0);
  const searchTerms = ["Pizza", "Burger", "Pasta", "Salad", "Sandwich", "Soup", "Pita Pocket"];

  useEffect(() => {
    const id = setInterval(() => setIdx((prev) => (prev + 1) % searchTerms.length), 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <Link to={SearchPage().href}>
      <Button startContent={<Search size={16} />} className="overflow-hidden justify-normal w-full rounded-full text-gray-500 bg-input hover:bg-input" variant="secondary">
        Search{" "}
        {searchTerms.map((_, i) => {
          if (idx === i) {
            return (
              <motion.span initial={{ translateY: "20px", opacity: 0 }} animate={{ translateY: "0px", opacity: 100 }} key={i}>
                "{searchTerms[idx]}"
              </motion.span>
            );
          }
          return <React.Fragment key={i} />;
        })}
      </Button>
    </Link>
  );
};

const PromotionalCards = () => {
  const [api, setApi] = React.useState<CarouselApi>();

  React.useEffect(() => {
    if (!api) return;

    const id = setInterval(() => {
      api.scrollNext();
    }, 3000);
    return () => clearInterval(id);
  }, [api]);

  return (
    <div>
      <Carousel setApi={setApi} opts={{ loop: true, align: "center" }}>
        <CarouselContent>
          {PROMOTIONAL_CARDS.map(({ title, description, img, bgImg }, i) => (
            <CarouselItem key={i}>
              <OfferCard title={title} description={description} img={img} bgImg={bgImg} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export const OfferCard = ({ title, description, img, bgImg }: { title: string; description: string; img: string; bgImg: string }) => {
  return (
    <div>
      <div className="relative p-4 rounded-xl overflow-hidden bg-no-repeat bg-cover flex gap-x-2 w-full" style={{ backgroundImage: `url(${bgImg})` }}>
        <Link to={PAGES.OffersPage.href}>
          <Typography className="z-[2] text-white absolute right-4 top-2">View all</Typography>
        </Link>
        <div>
          <Typography variant="h1" className="text-white">
            {title}
          </Typography>
          <Typography
            variant="md"
            className="text-white max-w-[200px]"
            dangerouslySetInnerHTML={{
              __html: description.replace("\n", "<br/>"),
            }}
          />
        </div>
        <img className="w-32 h-32 object-contain absolute right-8" src={img} />
      </div>
    </div>
  );
};
