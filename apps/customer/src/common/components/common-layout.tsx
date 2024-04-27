import { Outlet } from "react-router-dom";
import BottomTabs from "./bottom-tabs";
import Navbar from "./navbar";

const CommonLayout = () => {
  return (
    <main className="bg-gray-50 dark:bg-[#181a20]">
      <Navbar />
      <div className="pb-[90px] min-h-[calc(100vh-120px)]">
        <Outlet />
      </div>
      <BottomTabs />
    </main>
  );
};

export default CommonLayout;
