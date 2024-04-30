import { Outlet, Navigate, useSearchParams, useLocation } from "react-router-dom";
import BottomTabs from "./bottom-tabs";
import Navbar from "./navbar";
import { useEffect } from "react";
import { PAGES } from "../utils/pages";

const CommonLayout = ({ showBottomTabs = true }: { showBottomTabs?: boolean }) => {
  const [sp, ssp] = useSearchParams();
  const { pathname } = useLocation();
  const restaurantId = sp.get("restaurantId") ?? localStorage.getItem("restaurantId");
  const tableId = sp.get("tableId") ?? localStorage.getItem("tableId");

  useEffect(() => {
    if (restaurantId) {
      localStorage.setItem("restaurantId", restaurantId);
      ssp({});
    }
    if (tableId) {
      localStorage.setItem("tableId", tableId);
      ssp({});
    }
  }, [restaurantId, pathname, tableId]);

  // route the user to the /restaurant page, iff either tableId doesn't exists or restaurant Id doesn't exists, if restaurantId exists then route to that particular restaurant page, and also make sure don't route if the user is on the page that starts with /restaurants

  if (pathname && !pathname.startsWith("/restaurants") && (!restaurantId || !tableId)) {
    if (restaurantId) {
      return <Navigate to={PAGES.RestaurantDetailsPage(restaurantId).href} />;
    }
    return <Navigate to={PAGES.RegisterPage.href} />;
  }

  return (
    <main className="bg-background">
      <Navbar />
      <div className="pb-4 min-h-[calc(100vh-125px)]">
        <Outlet />
      </div>
      {!showBottomTabs || !restaurantId ? null : <BottomTabs />}
    </main>
  );
};

export default CommonLayout;
