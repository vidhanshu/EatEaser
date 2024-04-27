import { Outlet, useSearchParams } from "react-router-dom";
import BottomTabs from "./bottom-tabs";
import Navbar from "./navbar";
import { useEffect } from "react";

const CommonLayout = ({ showBottomTabs = true }: { showBottomTabs?: boolean }) => {
  const [sp] = useSearchParams();
  const rid = sp.get("rid");

  useEffect(() => {
    if (rid) {
      localStorage.setItem("restaurantId", rid);
    }
  }, [rid]);

  return (
    <main className="bg-gray-50 dark:bg-[#181a20]">
      <Navbar />
      <div className="pb-[90px] min-h-[calc(100vh-120px)]">
        <Outlet />
      </div>
      {showBottomTabs && <BottomTabs />}
    </main>
  );
};

export default CommonLayout;
