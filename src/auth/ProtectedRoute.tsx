import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

type ProtectedRouteProps = {
  requiredRole?: string;
};

const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  const user = useSelector((state: RootState) => state.user);
  const accessToken = localStorage.getItem("accessToken");

  // Show nothing (or a spinner) while loading user data
  if (user.loading) {
    return null; // Optionally return a loading spinner instead
  }

  // Redirect if user not authenticated
  if (!user._id || !accessToken) {
    return <Navigate to="/" replace />;
  }

  // Redirect if user doesn't have required role
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
