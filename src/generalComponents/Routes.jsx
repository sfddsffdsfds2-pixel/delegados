import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContex";
import { FullScreenProgress } from "./FullScreenProgress";

export const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, authLoading, user } = useAuth();

  if (authLoading) {
    return <FullScreenProgress text="Cargando..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/iniciar-sesion" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.rol)) {
    return <Navigate to="/" replace />;
  }

  // Usuario autenticado y con rol permitido
  return children;
};
export const PublicRoute = ({ element }) => {
  const { user, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    if(user?.rol === 'admin') {
      return <Navigate to="/lista-delegados-admin" replace />;
    } else if(user?.rol === 'jefe_recinto'){
      return <Navigate to="/lista-delegados-jr" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return element;
};