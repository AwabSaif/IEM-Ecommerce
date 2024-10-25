// Importing the useContext hook from the React library
import { useContext } from "react";

// Importing the AuthContext from the AuthProvider context
import AuthContext from "../context/AuthProvider";

// Defining a custom hook called useAuth
const useAuth = () => {
  // Using the useContext hook to access the AuthContext
  // This hook allows components to consume the authentication state provided by the AuthProvider
  return useContext(AuthContext);
}

// Exporting the useAuth hook to be used in other components
export default useAuth;
