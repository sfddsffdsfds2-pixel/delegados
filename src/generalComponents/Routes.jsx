import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContex";
import { FullScreenProgress } from "./FullScreenProgress";

export const PrivateRoute = ({ children }) => {
  const { isAuthenticated, authLoading } = useAuth();

  if (!isAuthenticated && authLoading) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export const PublicRoute = ({ element }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/lista-delegados" replace />;
  }

  return element;
};