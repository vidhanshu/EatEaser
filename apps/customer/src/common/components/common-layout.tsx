import { Button, GenericDialog, Typography } from "@ui/components";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { SocketContextProvider } from "../contexts/socket";
import { K_RESTAURANT_ID, K_TABLE_ID } from "../utils/constants";
import { PAGES } from "../utils/pages";
import BottomTabs from "./bottom-tabs";
import Navbar from "./navbar";

const CommonLayout = ({ showBottomTabs = true }: { showBottomTabs?: boolean }) => {
  const [sp] = useSearchParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const rid = sp.get(K_RESTAURANT_ID);
  const lRid = localStorage.getItem(K_RESTAURANT_ID);
  const restaurantId = rid ?? lRid;
  const tid = sp.get(K_TABLE_ID);
  const lTid = localStorage.getItem(K_TABLE_ID);
  const tableId = rid && rid !== lRid ? undefined : tid ?? lTid;

  useEffect(() => {
    if (restaurantId) {
      localStorage.setItem(K_RESTAURANT_ID, restaurantId);
    }
    if (tableId) {
      localStorage.setItem(K_TABLE_ID, tableId);
    } else {
      localStorage.removeItem(K_TABLE_ID);
    }
  }, [restaurantId, tableId]);

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
    <SocketContextProvider>
      <main className="bg-background">
        <Navbar />
        <div className="pb-4 min-h-[calc(100vh-120px)]">
          <Outlet />
        </div>
        {!showBottomTabs || !restaurantId ? null : <BottomTabs />}
        {conditionalContent}
      </main>
    </SocketContextProvider>
  );
};

export default CommonLayout;
