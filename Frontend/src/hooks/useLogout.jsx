// Importing Axios instance from "../api/axios"
import axios from "../api/axios";
// Importing the useAuth custom hook
import useAuth from "./useAuth";

// Defining the useLogout custom hook
const useLogout = () => {
  // Destructuring the auth object and setAuth function from useAuth hook
  const { auth, setAuth } = useAuth();
  // Extracting the token from the auth object
  const token = auth.token;

  // Defining the logout function
  const logout = async () => {
    // Clearing the auth state
    setAuth({});
    try {
      // Sending a logout request to the server
      const response = await axios("/api/users/logout", {
        method: "POST",
        headers: {
          Accept: "application/json",
          // Sending the token in the Authorization header for authentication
          Authorization: "Bearer " + token,
        },
        // Including credentials in the request (cookies, for authentication)
         
      });
    } catch (err) {
      // Handling any errors that occur during the logout process
      console.log(err);
    }
  };

  // Returning the logout function to be used by components
  return logout;
};

// Exporting the useLogout custom hook
export default useLogout;
