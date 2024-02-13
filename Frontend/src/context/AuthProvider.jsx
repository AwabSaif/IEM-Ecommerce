// Importing necessary modules from React library
import { createContext, useState } from "react";

// Creating a new context called AuthContext using createContext() function
const AuthContext = createContext({});

// Creating a new component called AuthProvider using a functional component
// It takes 'children' as a prop which represents the child components wrapped by AuthProvider
export const AuthProvider = ({ children }) => {
  // Declaring state variable 'auth' using useState() hook with initial value of an empty object
  const [auth, setAuth] = useState({});
  
  // Returning JSX markup
  return (
    // Providing the AuthContext to its children using AuthContext.Provider
    <AuthContext.Provider value={{ auth, setAuth }}>
      {/* Rendering child components */}
      {children}
    </AuthContext.Provider>
  );
};

// Exporting the AuthContext as default export
export default AuthContext;
