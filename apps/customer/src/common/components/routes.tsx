import { Navigate, RouteObject, RouterProvider, createBrowserRouter } from "react-router-dom";

import ErrorPage from "../pages/error-page";
import ProtectedRoute from "./protected-route";
import SignInPage from "@src/auth/pages/sign-in";
import SignUpPage from "@src/auth/pages/sign-up";
import MenuPage from "@src/menu/pages/menu-page";
import useAuthStore from "@src/common/stores/auth-store";
import VerifyEmail from "@src/auth/pages/verify-email";
import CommonLayout from "./common-layout";
import SearchPage from "@src/search/pages/search-page";
import SettingsPage from "@src/settings/pages/settings-page";
import CartPage from "@src/cart/pages/cart-page";
import MenuDetailsPage from "@src/menu/pages/menu-details-page";

/**
 * ROUTES_FOR_ONLY_UNAUTHENTICATED, are accessible only to unauthenticated users
 */
const ROUTES_FOR_ONLY_UNAUTHENTICATED: RouteObject[] = [
  {
    path: "/",
    element: <CommonLayout showBottomTabs={false} />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <MenuPage />,
      },
      {
        path: "/sign-in",
        element: <SignInPage />,
      },
      {
        path: "/sign-up",
        element: <SignUpPage />,
      },
      {
        path: "*",
        element: <Navigate to="/sign-in" />,
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
        element: <MenuPage />,
      },
      {
        path: "/menu/:id",
        element: <MenuDetailsPage />,
      },
      {
        path: "/profile",
        element: <div>Hello world!</div>,
      },
      {
        path: "/search",
        element: <SearchPage />,
      },
      {
        path: "/settings",
        element: <SettingsPage />,
      },
      {
        path: "/cart",
        element: <CartPage />,
      },
      {
        path: "/verify-email",
        element: <VerifyEmail />,
      },
    ],
    errorElement: <ErrorPage />,
  },
];
const Routes = () => {
  const token = useAuthStore((data) => data.token);

  const router = createBrowserRouter([...(!token ? ROUTES_FOR_ONLY_UNAUTHENTICATED : []), ...ROUTES_FOR_ONLY_AUTHENTICATED]);
  return <RouterProvider router={router} />;
};

export default Routes;
