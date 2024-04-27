import { Navigate } from "react-router-dom";
import useAuthStore from "../stores/auth-store";

const ProtectedRoute = ({ children }: React.PropsWithChildren) => {
  const isAuth = useAuthStore((set) => set.isAuthenticated());
  if (!isAuth) {
    return <Navigate to="/sign-in" />;
  }
  return children;
};

export default ProtectedRoute;
