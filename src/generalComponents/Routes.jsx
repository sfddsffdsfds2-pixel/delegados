import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContex";
import { FullScreenProgress } from "./FullScreenProgress";
import NotFoundPage from "./NotFoundPage";

export const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, authLoading, user } = useAuth();

  if (authLoading) {
    return <FullScreenProgress text="Cargando..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/iniciar-sesion" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.rol)) {
    return (
      <NotFoundPage
        message="Página no encontrada"
        showButton={false}
      />
    )
  }

  return children;
};

export const PublicRoute = ({ element }) => {
  const { user, isAuthenticated, authLoading } = useAuth();

  if (authLoading) {
    return <FullScreenProgress text="Cargando..." />;
  }

  if (isAuthenticated) {
    switch (user?.rol) {
      case "super_admin":
      case "admin":
        return <Navigate to="/lista-delegados-admin" replace />;
      case "jefe_recinto":
        return <Navigate to="/lista-delegados-jr" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }
  return element;
};
