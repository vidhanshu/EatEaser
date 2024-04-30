import { Outlet, useSearchParams, useLocation, useNavigate } from "react-router-dom";
import BottomTabs from "./bottom-tabs";
import Navbar from "./navbar";
import { useEffect } from "react";
import { PAGES } from "../utils/pages";
import { Button, GenericDialog, Typography } from "@ui/components";

const CommonLayout = ({ showBottomTabs = true }: { showBottomTabs?: boolean }) => {
  const [sp, ssp] = useSearchParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
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

  // route the user to the /restaurant page, iff either tableId doesn't exists or restaurant Id doesn't exists,
  // if restaurantId exists then route to that particular restaurant page, and also make sure don't route if the user is on the page that starts with /restaurants
  let conditionalContent = null;
  if (pathname && !pathname.startsWith("/restaurants") && !pathname.startsWith("/sign-") && (!restaurantId || !tableId)) {
    if (restaurantId) {
      conditionalContent = (
        <GenericDialog
          dialogContentProps={{ className: "max-w-[calc(100%-32px)] sm:max-w-[350px] rounded-md" }}
          dialogTitle="Choose Table please!"
          queryControlled={{ open: true, setOpen: () => {} }}
          content={
            <div className="flex flex-col items-center space-y-4">
              <Typography variant="muted" className="text-center">
                Choosing table is necessary to continue with ordering your delicious food!
              </Typography>
              <Button onClick={() => navigate(`${PAGES.RestaurantDetailsPage(restaurantId).href}#tables`)}>Continue</Button>
            </div>
          }
        />
      );
    } else {
      conditionalContent = (
        <GenericDialog
          dialogContentProps={{ className: "max-w-[calc(100%-32px)] sm:max-w-[350px] rounded-md" }}
          dialogTitle="Choose restaurant please!"
          queryControlled={{ open: true, setOpen: () => {} }}
          content={
            <div className="flex flex-col items-center space-y-4">
              <Typography variant="muted" className="text-center">
                Choosing restaurant is necessary to continue with ordering your delicious food!
              </Typography>
              <Button onClick={() => navigate(`${PAGES.RestaurantsPage.href}`)}>Continue</Button>
            </div>
          }
        />
      );
    }
  }

  return (
    <main className="bg-background">
      <Navbar />
      <div className="pb-4 min-h-[calc(100vh-125px)]">
        <Outlet />
      </div>
      {!showBottomTabs || !restaurantId ? null : <BottomTabs />}
      {conditionalContent}
    </main>
  );
};

export default CommonLayout;
