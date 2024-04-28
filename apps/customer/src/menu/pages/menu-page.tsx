import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import React, { useEffect, useMemo, useState } from "react";

import Menu from "@src/menu/components/menu";
import useCategory from "@src/menu/hooks/use-categories";
import { PROMOTIONAL_CARDS } from "@src/menu/utils/constants";
import useMenu, { IMenuFilters } from "@src/menu/hooks/use-menu";
import CategoriesTabs from "@src/menu/components/categories-tabs";
import { Button, Typography, Carousel, CarouselContent, CarouselItem, CarouselApi } from "@repo/ui";

const MenuPage = () => {
  const [sp] = useSearchParams();

  const category = sp.get("category") ?? undefined;
  const minPrice = sp.get("minPrice") ?? undefined;
  const maxPrice = sp.get("maxPrice") ?? undefined;
  const isAvailable = sp.get("isAvailable") ?? undefined;
  const isVegetarian = sp.get("isVegetarian") ?? undefined;

  const filters: IMenuFilters = useMemo(() => {
    const cat: IMenuFilters = { category: category === "all" ? undefined : category };
    cat.isAvailable = isAvailable === "true" ? true : isAvailable === "false" ? false : undefined;
    cat.isVegetarian = isVegetarian === "true" ? true : isVegetarian === "false" ? false : undefined;
    cat.minPrice = minPrice;
    cat.maxPrice = maxPrice;
    return cat;
  }, [category, isAvailable, isVegetarian, minPrice, maxPrice]);

  const { categories: { result: categories = [] } = {}, isLoadingCategories } = useCategory({});
  const { menuItems: { result: menuItems = [] } = {}, isLoadingMenuItems } = useMenu({
    variables: { filters },
  });

  return (
    <div className="px-4 space-y-4 pt-8">
      <AnimatedSearchButton />
      <PromotionalCards />
      <CategoriesTabs categories={categories} isLoading={isLoadingCategories} />
      <Menu menuItems={menuItems} isLoading={isLoadingMenuItems} />
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
    <Link to="/search">
      <Button
        startContent={<Search size={16} />}
        className="overflow-hidden justify-normal w-full rounded-full text-gray-500 dark:bg-[#1f222a] bg-gray-200 hover:bg-gray-200"
        variant="secondary"
      >
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
              <div className="relative p-4 rounded-xl overflow-hidden bg-no-repeat bg-cover flex gap-x-2 w-full" style={{ backgroundImage: `url(${bgImg})` }}>
                <Typography className="z-[2] text-white absolute right-4 top-2">View all</Typography>
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
                <img className="w-28 h-28 absolute right-8" src={img} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};
