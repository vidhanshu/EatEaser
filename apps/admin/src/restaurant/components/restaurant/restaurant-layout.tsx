import { Outlet, useLocation } from "react-router-dom";
import {
  RESTAURANT_EDIT_PAGE_TABS,
  RESTAURANT_PAGE_TABS,
} from "../../utils/constants";
import { LinkTabs } from "@ui/components";

const TABS = {
  normal: RESTAURANT_PAGE_TABS,
  edit: RESTAURANT_EDIT_PAGE_TABS,
};

export const RestaurantLayout = () => {
  const pathname = useLocation().pathname;
  let tabs: (typeof RESTAURANT_PAGE_TABS)[0][] = [];
  if (pathname.includes("restaurant/edit")) {
    tabs = TABS.edit;
  } else {
    tabs = TABS.normal;
  }

  return (
    <>
      <div className="flex gap-x-4 border-b">
        <LinkTabs tabsData={tabs} />
      </div>
      <div className="py-8">
        <Outlet />
      </div>
    </>
  );
};

export default RestaurantLayout;
