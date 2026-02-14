import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContex";
import { FullScreenProgress } from "./FullScreenProgress";

export const PrivateRoute = ({ children }) => {
  const { isAuthenticated, authLoading } = useAuth();

  // 1) Mientras carga, NO redirijas
  if (authLoading) return <FullScreenProgress />;

  // 2) Cuando ya terminó de cargar, si no está autenticado => al login
  if (!isAuthenticated) return <Navigate to="/iniciar-sesión" replace />;

  // 3) Autenticado => entra
  return children;
};

export const PublicRoute = ({ element }) => {
  const { isAuthenticated, authLoading } = useAuth();

  // (recomendado) evitar parpadeos
  if (authLoading) return <FullScreenProgress />;

  // Si está autenticado, lo mandas a la parte privada
  if (isAuthenticated) return <Navigate to="/lista-delegados" replace />;

  return element;
};
