import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import useRefreshToken from "../../hooks/useRefreshToken";
import useAuth from "../../hooks/useAuth";
import Loading from "../../components/Loader/Loading";

// Component to handle persisting login state
const PersistLogin = () => {
  // State to manage loading state
  const [isLoading, setIsLoading] = useState(true);
  // Custom hook to refresh token
  const refresh = useRefreshToken();
  
  // Custom hook to manage authentication state
  const { auth, setAuth } = useAuth();
  const token = auth.token;
  
  // Effect to handle refresh token process
  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
  
    // Check if token exists, if not, verify refresh token
    !token ? verifyRefreshToken() : setIsLoading(false);
  }, []);

  // Effect to log state changes for isLoading and auth
  useEffect(() => {
    // Uncomment below lines for debugging purposes
    // console.log(`isLoading: ${isLoading}`);
    // console.log(`auth: ${JSON.stringify(auth)}`);
  }, [isLoading]);

  // Render loading component if still loading, otherwise render child components
  return <>{isLoading ? <Loading /> : <Outlet />}</>;
};
export default PersistLogin;
