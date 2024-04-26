import {
  RouteObject,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

import ErrorPage from "../pages/error-page";
import ProtectedRoute from "./protected-route";
import SignInPage from "@src/auth/pages/sign-in";
import SignUpPage from "@src/auth/pages/sign-up";
import MenuPage from "@src/menu/pages/menu-page";
import useAuthStore from "@src/common/stores/auth-store";
import LandingPage from "@src/home/pages/landing-page";
import VerifyEmail from "@src/auth/pages/verify-email";

/**
 * PUBLIC_ROUTES, are accessible to both authenticated and unauthenticated users
 */
const PUBLIC_ROUTES: RouteObject[] = [];
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
        element: <LandingPage />,
      },
      {
        path: "/sign-in",
        element: <SignInPage />,
      },
      {
        path: "/sign-up",
        element: <SignUpPage />,
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
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <MenuPage />,
      },
      {
        path: "/profile",
        element: <div>Hello world!</div>,
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

  const router = createBrowserRouter([
    ...PUBLIC_ROUTES,
    ...(!token ? ROUTES_FOR_ONLY_UNAUTHENTICATED : []),
    ...ROUTES_FOR_ONLY_AUTHENTICATED,
  ]);
  return <RouterProvider router={router} />;
};

export default Routes;
