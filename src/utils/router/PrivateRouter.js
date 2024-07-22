import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoutes() {
  const token = useSelector((store) => store.user.token);
  const isAuthenticated = !!token;
  return isAuthenticated ? <Outlet /> : <Navigate to="login" />;
}
