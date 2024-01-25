import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";


const RequireAuth = () => {
  const { auth } = useAuth();
  const location = useLocation();

  const isAdmin =  auth.roles === true;

  return (

    isAdmin
    ? <Outlet />
    :  auth?.email
    ? <Navigate to="/unauthorized" state={{ from: location }} replace />
    : <Navigate to="/login" state={{ from: location }} replace />
    )  
    
};


export default RequireAuth;
