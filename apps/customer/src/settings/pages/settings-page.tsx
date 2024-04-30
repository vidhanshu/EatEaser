import { GenericAlertDialog, Switch, useTheme } from "@repo/ui";
import PageMeta from "@src/common/components/page-meta";
import SignOutBtn from "@src/common/components/sign-out-btn";
import { PAGES, ProfilePage } from "@src/common/utils/pages";
import { ChevronRight, LogOut, Palette, Truck, User2 } from "lucide-react";
import { Link } from "react-router-dom";

const SettingsPage = () => {
  const { toggleTheme, theme } = useTheme();
  return (
    <main className="px-4 pt-8">
      <PageMeta title={PAGES.SettingsPage.title} description={PAGES.SettingsPage.description} />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-base font-medium">Settings</h1>
      </div>
      <Link to={ProfilePage.href}>
        <button className="flex py-4 justify-between items-center w-full border-b dark:border-gray-800">
          <span className="flex gap-x-4 items-center">
            <User2 size={16} /> Profile
          </span>{" "}
          <ChevronRight />
        </button>
      </Link>
      <Link to="/orders">
        <button className="flex py-4 justify-between items-center w-full border-b dark:border-gray-800">
          <span className="flex gap-x-4 items-center">
            <Truck size={16} /> Orders
          </span>{" "}
          <ChevronRight />
        </button>
      </Link>
      <div onClick={toggleTheme} className="cursor-pointer flex py-4 justify-between items-center w-full border-b dark:border-gray-800">
        <span className="flex gap-x-4 items-center">
          <Palette size={16} /> Toggle Theme
        </span>{" "}
        <Switch checked={theme === "dark" ? true : false} />
      </div>
      {
        <SignOutBtn>
          {(signOut) => (
            <GenericAlertDialog
              className="max-w-[95vw] w-fit min-w-[350px] rounded-md p-4 dark:border-gray-800"
              title="Are you sure?"
              description="You'll be signed out of the account!"
              onOk={signOut}
              okBtnTitle="Sign out"
            >
              <div className="cursor-pointer flex py-4 justify-between items-center w-full border-b dark:border-gray-800 text-rose-500">
                <span className="flex gap-x-4 items-center">
                  <LogOut size={16} /> Sign out
                </span>{" "}
                <ChevronRight />
              </div>
            </GenericAlertDialog>
          )}
        </SignOutBtn>
      }
    </main>
  );
};

export default SettingsPage;
