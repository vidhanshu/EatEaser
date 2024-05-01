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
import ProfilePage from "@src/profile/pages/profile-page";
import OrderPage from "@src/orders/pages/orders-page";
import RestaurantsPage from "@src/restaurants/pages/restaurants-page";
import RestaurantDetailsPage from "@src/restaurants/pages/restaurant-details-page";
import { PAGES } from "../utils/pages";
import NotFoundPage from "../pages/not-found-page";
import OffersPage from "@src/offers/pages/offers-page";
import CheckoutPage from "@src/cart/pages/checkout-page";

/**
 * ROUTES_FOR_ONLY_UNAUTHENTICATED, are accessible only to unauthenticated users
 */
const ROUTES_FOR_ONLY_UNAUTHENTICATED: RouteObject[] = [
  {
    path: "/",
    errorElement: <ErrorPage />,
    element: <CommonLayout showBottomTabs={false} />,
    children: [
      {
        path: "/",
        element: <MenuPage />,
      },
      {
        path: PAGES.LoginPage.href,
        element: <SignInPage />,
      },
      {
        path: PAGES.RegisterPage.href,
        element: <SignUpPage />,
      },
      {
        path: PAGES.RestaurantsPage.href,
        element: <RestaurantsPage />,
      },
      {
        path: "/restaurants/:id",
        element: <RestaurantDetailsPage />,
      },
      {
        path: "*",
        element: <Navigate to={PAGES.LoginPage.href} />,
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
        path: "/offers",
        element: <OffersPage />,
      },
      {
        path: "/restaurants",
        element: <RestaurantsPage />,
      },
      {
        path: "/restaurants/:id",
        element: <RestaurantDetailsPage />,
      },
      {
        path: "/menu/:id",
        element: <MenuDetailsPage />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
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
        path: "/orders",
        element: <OrderPage />,
      },
      {
        path: "/cart",
        element: <CartPage />,
      },
      {
        path: "/checkout",
        element: <CheckoutPage />,
      },
      {
        path: "/verify-email",
        element: <VerifyEmail />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
    errorElement: <ErrorPage />,
  },
];
const Routes = () => {
  const isAuth = useAuthStore((data) => data.isAuthenticated());

  const router = createBrowserRouter(!isAuth ? ROUTES_FOR_ONLY_UNAUTHENTICATED : ROUTES_FOR_ONLY_AUTHENTICATED);
  return <RouterProvider router={router} />;
};

export default Routes;
