import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

// Component responsible for requiring authentication
const RequireAuth = () => {
  // Fetch authentication status using custom hook
  const { auth } = useAuth();

  // Get the current location
  const location = useLocation();

  // Check if the user is an admin
  const isAdmin = auth.roles === true;

  return (
    // Render child components based on authentication status
    isAdmin
    // If user is admin, allow access to child components
    ? <Outlet />
    // If user is authenticated but not an admin, redirect to unauthorized page
    : auth?.email
    ? <Navigate to="/unauthorized" state={{ from: location }} replace />
    // If user is not authenticated, redirect to login page
    : <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
