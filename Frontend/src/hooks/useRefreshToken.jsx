import axios from "../api/axios";
import useAuth from "./useAuth";
import Cookies from "cookie-universal";

const useRefreshToken = () => {
  const { setAuth, auth } = useAuth();

  const cookie = new Cookies();

  const refresh = async () => {
    try {
         const response = await axios.get("/api/users/refresh/token", {
      
          withCredentials: true,
      });  


      console.log(response.data);
      setAuth(() => {
        const token = response.data.token;
        const tokencookie = cookie.set("Bearer", token);
        return {
          name: response.data.name,
          email: response.data.email,
          roles: response.data.roles,
          token: token,
          id: response.data.id,
        };
      });

      return response.data.token;
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
  };
  return refresh;
};
export default useRefreshToken;
