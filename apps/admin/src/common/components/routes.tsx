import {
  RouteObject,
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";

import ErrorPage from "../pages/error-page";
import ProtectedRoute from "./protected-route";
import SignInPage from "@src/auth/pages/signin-page";
import useAuthStore from "@src/common/stores/auth-store";
import CommonLayout from "./common-layout";
import DashboardPage from "@src/dashboard/pages/dashboard-page";
import RestaurantPage from "@src/restaurant/pages/restaurant-page";
import RestaurantLayout from "@src/restaurant/components/restaurant/restaurant-layout";
import RestaurantEditPage from "@src/restaurant/pages/restaurant-edit-page";
import RestaurantEditOHPage from "@src/restaurant/pages/restaurant-oh-edit-page";
import TablePage from "@src/restaurant/pages/table-page";
import { APP_ROUTES } from "../utils/app-routes";
import MenuLayout from "@src/menu/components/menu-layout";
import MenuPage from "@src/menu/pages/menu-page";
import MenuViewPage from "@src/menu/pages/menu-view-page";
import CategoriesPage from "@src/menu/pages/categories-page";
import AddOnsPage from "@src/menu/pages/add-ons-page";
import MenuCreateEditPage from "@src/menu/pages/menu-ce-page";
import OrdersPage from "@src/orders/pages/orders-page";
import StaffsPage from "@src/staff/page/staffs-page";
import SettingsPage from "@src/settings/page/settings-page";

/**
 * ROUTES_FOR_ONLY_UNAUTHENTICATED, are accessible only to unauthenticated users
 */
const ROUTES_FOR_ONLY_UNAUTHENTICATED: RouteObject[] = [
  {
    path: "/",
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <SignInPage />,
      },
    ],
  },
];
/**
 * ROUTES_FOR_ONLY_AUTHENTICATED, are accessible only to authenticated users
 */
const ROUTES_FOR_ONLY_AUTHENTICATED: RouteObject[] = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <CommonLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/",
        element: <Navigate to={APP_ROUTES.dashboard} />,
      },
      {
        path: APP_ROUTES.dashboard,
        element: <DashboardPage />,
      },
      {
        path: "/",
        element: <RestaurantLayout />,
        children: [
          {
            path: APP_ROUTES.restaurant,
            element: <RestaurantPage />,
          },
          {
            path: APP_ROUTES.restaurantEdit,
            element: <RestaurantEditPage />,
          },
          {
            path: APP_ROUTES.restaurantEditOH,
            element: <RestaurantEditOHPage />,
          },
          {
            path: APP_ROUTES.restaurantTables,
            element: <TablePage />,
          },
        ],
      },
      {
        path: "/",
        element: <MenuLayout />,
        children: [
          {
            path: APP_ROUTES.menu,
            element: <MenuPage />,
          },
          {
            path: APP_ROUTES.menuEdit,
            element: <MenuCreateEditPage />,
          },
          {
            path: APP_ROUTES.menuCategories,
            element: <CategoriesPage />,
          },
          {
            path: "/menu/view",
            element: <Navigate to={APP_ROUTES.menu} />,
          },
          {
            path: APP_ROUTES.menuView,
            element: <MenuViewPage />,
          },
          {
            path: APP_ROUTES.menuAddOns,
            element: <AddOnsPage />,
          },
        ],
      },
      {
        path: APP_ROUTES.orders,
        element: <OrdersPage />,
      },
      {
        path: APP_ROUTES.staffs,
        element: <StaffsPage />,
      },
      {
        path: APP_ROUTES.settings,
        element: <SettingsPage />,
      },
    ],
    errorElement: <ErrorPage />,
  },
];
const Routes = () => {
  const isAuth = useAuthStore((set) => set.isAuthenticated());

  const router = createBrowserRouter([
    ...(!isAuth
      ? ROUTES_FOR_ONLY_UNAUTHENTICATED
      : ROUTES_FOR_ONLY_AUTHENTICATED),
  ]);
  return <RouterProvider router={router} />;
};

export default Routes;
