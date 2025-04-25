import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const ProtectedRoute = () => {
  const user = useSelector((state: RootState) => state.user);
  const accessToken = localStorage.getItem("accessToken");

  if (!user._id || !accessToken) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;