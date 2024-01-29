import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import useRefreshToken from "../../hooks/useRefreshToken";
import useAuth from "../../hooks/useAuth";
import Loading from "../../components/Loader/Loading";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();

 
  const { auth, setAuth } = useAuth();
  const token = auth.token;
  useEffect(() => {
    const verifyRefershToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.log(err);
    
    }finally {
        setIsLoading(false);
      }
    };
  
    !token ? verifyRefershToken() : setIsLoading(false);
  }, []);
  useEffect(() => {
    // console.log(`isloding: ${isLoading}`);
    // console.log(`aT: ${JSON.stringify(auth)}`);
  }, [isLoading]);

  return <>{isLoading ? <Loading /> : <Outlet />}</>;
};
export default PersistLogin;
 