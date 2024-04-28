import { Outlet, Navigate, useSearchParams, useLocation } from "react-router-dom";
import BottomTabs from "./bottom-tabs";
import Navbar from "./navbar";
import { useEffect } from "react";

const CommonLayout = ({ showBottomTabs = true }: { showBottomTabs?: boolean }) => {
  const [sp] = useSearchParams();
  const { pathname } = useLocation();
  const rid = sp.get("rid") ?? localStorage.getItem("restaurantId");

  useEffect(() => {
    if (rid) {
      localStorage.setItem("restaurantId", rid);
    }
  }, [rid, pathname]);

  if (!rid && pathname !== "/restaurants") return <Navigate to="/restaurants" />;

  return (
    <main className="bg-background">
      <Navbar />
      <div className="pb-4 min-h-[calc(100vh-120px)]">
        <Outlet />
      </div>
      {!showBottomTabs || !rid ? null : <BottomTabs />}
    </main>
  );
};

export default CommonLayout;
