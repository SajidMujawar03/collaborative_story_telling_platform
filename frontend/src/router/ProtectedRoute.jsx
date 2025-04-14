import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { auth } = useAuth();

  if (!auth.user || (role && auth.user.role !== role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};
