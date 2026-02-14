import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContex";
import { FullScreenProgress } from "./FullScreenProgress";

export const PrivateRoute = ({ children }) => {
  const { isAuthenticated, authLoading } = useAuth();

  if (authLoading) return <FullScreenProgress />;

  if (!isAuthenticated) return <Navigate to="/iniciar-sesión" replace />;

  return children;
};

export const PublicRoute = ({ element }) => {
  const { isAuthenticated, authLoading } = useAuth();

  if (authLoading) return <FullScreenProgress />;

  if (isAuthenticated) return <Navigate to="/lista-delegados" replace />;

  return element;
};