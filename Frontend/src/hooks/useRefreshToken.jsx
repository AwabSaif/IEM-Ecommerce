import axios from "../api/axios";
import useAuth from "./useAuth";
import Cookies from "cookie-universal";

const useRefreshToken = () => {
  const { setAuth, auth } = useAuth();

  const cookie = new Cookies();

  const getToken = cookie.get("Bearer");

  const refresh = async () => {
    try {
      const response = await axios.get("/api/users/refresh/token", {
        headers: {
          Accept: "application/json",
          Authorization: getToken,
        },
      });

      setAuth(() => {
        const token = response.data.token;
        const tokencookie = cookie.set("Bearer", token);
        return {
          email: response.data.email,
          roles: response.data.roles,
          token: token,
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
