// Importing Axios instance configured with baseURL
import axios from "../api/axios";
// Importing custom hook for handling authentication
import useAuth from "./useAuth";
// Importing cookie-universal library for managing cookies
import Cookies from "cookie-universal";

// Custom hook for refreshing authentication token
const useRefreshToken = () => {
  // Creating a new instance of Cookies for managing cookies
  const cookie = new Cookies();
  // Using the useAuth custom hook to access authentication state and setter
  const { setAuth, auth } = useAuth();  

  // Function to refresh authentication token
  const refresh = async () => {
    try {
      // Making a GET request to the server to refresh token
      const response = await axios.get("/api/users/refresh/token", {
        // Including credentials in the request ( cookies)
        withCredentials: true,
      });
      // console.log(response.data);
      // Updating authentication state with the new token
      setAuth(() => {
        const token = response.data.token;
        // Setting JWT token in the cookie
        // const tokencookie = cookie.set('jwt', token);
        // Returning updated authentication object
        return {
          name: response.data.name,
          email: response.data.email,
          roles: response.data.roles,
          token: token,
          id: response.data.id,
        };
      });
      
      // Returning the refreshed token
      return response.data.token;
    } catch (error) {
      // Logging error if token refresh fails
      console.error("Error refreshing token:", error);
    }
  };
  // Returning the refresh function
  return refresh;
};

// Exporting the useRefreshToken custom hook
export default useRefreshToken;
