import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";



export default function ProtectedRoute({ roles, children }) {
  const { user } = useAuth();
  const location = useLocation();

  // ❌ Sin sesión → al login >:D
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // ❌ Rol inválido → fuera >:D
  if (!roles.includes(user.rol)) {
    return <Navigate to="/" replace />;
  }
  return children;
}
