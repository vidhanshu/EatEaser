import { Outlet, useLocation } from "react-router-dom";
import { MENU_EDIT_PAGE_TABS, MENU_PAGE_TABS } from "../utils/constants";
import { LinkTabs } from "@ui/components";
import { APP_ROUTES } from "@src/common/utils/app-routes";

const TABS = {
  normal: MENU_PAGE_TABS,
  edit: MENU_EDIT_PAGE_TABS,
};

export const MenuLayout = () => {
  const pathname = useLocation().pathname;
  let tabs: (typeof MENU_PAGE_TABS)[0][] = [];
  if (pathname.includes(APP_ROUTES.menuEdit)) {
    tabs = TABS.edit;
  } else if (pathname.includes("/menu/view")) {
    tabs = [];
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

export default MenuLayout;
