import { Outlet } from "react-router-dom";
import BottomTabs from "./bottom-tabs";
import Navbar from "./navbar";

const CommonLayout = () => {
  return (
    <main className="bg-gray-50">
      <Navbar />
      <div className="pt-8 pb-[90px] min-h-[calc(100vh-120px)]">
        <Outlet />
      </div>
      <BottomTabs />
    </main>
  );
};

export default CommonLayout;
