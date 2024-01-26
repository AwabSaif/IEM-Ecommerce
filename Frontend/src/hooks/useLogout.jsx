import axios from "../api/axios";
import useAuth from "./useAuth";
import Cookies from "cookie-universal";

const useLogout = () => {
  const { auth, setAuth } = useAuth();
  const token = auth.token;
  const cookie = new Cookies();
  
  
  const logout = async () => {
    setAuth({});
    try {
      const response = await axios("/api/users/logout", {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
        withCredentials: true,
      });
      cookie.remove('Bearer');
    } catch (err) {
      console.log(err);
    }
  };

  return logout;
};

export default useLogout;
