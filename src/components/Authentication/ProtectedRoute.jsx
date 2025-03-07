import { RequireAuth } from "react-auth-kit";
import { Navigate } from "react-router-dom";
import { useAuthUser } from "react-auth-kit";

const ProtectedRoute = ({ children, role }) => {
  const auth = useAuthUser();

  if (!auth()) return <Navigate to="/" />; // Redirect to home if not logged in
  if (role && auth().role !== role) return <Navigate to="/" />; // Redirect if wrong role

  return children;
};

export default ProtectedRoute;
