import React from "react";
import { Outlet, useLocation, Link } from "react-router-dom";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@ui/components";

import Navbar from "./navbar";
import Sidebar from "./sidebar";
import { cn } from "@ui/lib/utils";
import useSidebarStore from "@src/common/stores/sidebar-store";

const CommonLayout = () => {
  const open = useSidebarStore((state) => state.open);

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-[#0c1116]">
      <Navbar />
      <Sidebar iconOnly={!open} />
      {/* placeholder for navbar */}
      <div className="w-full h-[56px]" />
      <div className="flex">
        {/* placeholder for sidebar */}
        <div className={cn(open ? "w-[250px]" : "w-[85px]")} />
        <div
          className={cn(
            "px-4 md:px-8 py-6 flex-grow",
            open ? "max-w-[calc(100vw-270px)]" : "max-w-[calc(100vw-85px)]"
          )}
        >
          <BreadCrumbs />
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default CommonLayout;

export const BreadCrumbs = () => {
  const pathname = useLocation().pathname;

  if (pathname === "/dashboard") return null;

  const breadcrumbs = pathname
    .split("/")
    // Remove empty strings
    .filter(Boolean)
    // Map to object with label and href
    .map((path, idx, arr) => ({
      label: path,
      href: `/${arr.slice(0, idx + 1).join("/")}`,
    }));

  return (
    <Breadcrumb className="mb-2">
      <BreadcrumbList>
        {breadcrumbs.map(({ href, label }, idx) => (
          <React.Fragment key={href}>
            <BreadcrumbItem>
              <Link className="hover:underline" to={href}>
                {label}
              </Link>
            </BreadcrumbItem>
            {/* Have separator if either it's not a last link or there is only one link */}
            {(idx < breadcrumbs.length - 1 || breadcrumbs.length == 1) && (
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
