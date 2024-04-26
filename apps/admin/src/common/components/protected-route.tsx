import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../stores/auth-store";

const ProtectedRoute = ({ children }: React.PropsWithChildren) => {
  const isAuth = useAuthStore((set) => set.isAuthenticated());
  const path = useLocation().pathname;

  if (!isAuth) {
    return <Navigate to={`/?next=${path}`} />;
  }
  return children;
};

export default ProtectedRoute;
