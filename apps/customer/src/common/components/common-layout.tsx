import { Outlet, useSearchParams } from "react-router-dom";
import BottomTabs from "./bottom-tabs";
import Navbar from "./navbar";
import { useEffect } from "react";

const CommonLayout = ({ showBottomTabs = true }: { showBottomTabs?: boolean }) => {
  const [sp, ssp] = useSearchParams();
  const rid = sp.get("rid");

  useEffect(() => {
    if (rid) {
      localStorage.setItem("restaurantId", rid);
      ssp({});
    }
  }, [rid]);

  return (
    <main className="bg-background">
      <Navbar />
      <div className="pb-4 min-h-[calc(100vh-120px)]">
        <Outlet />
      </div>
      {showBottomTabs && <BottomTabs />}
    </main>
  );
};

export default CommonLayout;
