import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../stores/auth-store";

const ProtectedRoute = () => {
  const isAuth = useAuthStore((set) => set.isAuthenticated());
  if (!isAuth) {
    return <Navigate to="/sign-in" />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
