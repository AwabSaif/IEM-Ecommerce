import axios from "../api/axios";
import useAuth from "./useAuth";

const useLogout = () => {
  const { auth, setAuth } = useAuth();
  const token = auth.token;

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
      console.log(auth);
    } catch (err) {
      console.log(err);
    }
  };

  return logout;
};

export default useLogout;
