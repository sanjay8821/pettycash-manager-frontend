import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  const auth = useSelector((state) => state.auth);
  return auth.isAuthenticated ? children : <Navigate to="/login" />;
};

export const Guest = ({ children }) => {
  const auth = useSelector((state) => state.auth);

  return !auth.isAuthenticated ? children : <Navigate to="/" replace={true} />;
};
