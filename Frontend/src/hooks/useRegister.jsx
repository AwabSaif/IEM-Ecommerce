import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import axios from "../api/axios";

const REGISTER_URL = "/api/user/register";

export const useRegister = () => {
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();
  const Register1 = async (email, name, password) => {
    setIsLoading(true);
      setError(null);
    
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify({
          email,
          name,
          password,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response.data);
      const json = await response.json();
      setSuccess(true);
      
      if (!response.ok) {
        setIsLoading(false);
        setError(json.error);
      }

      if (response.ok) {
        //save the user to local storage
        localStorage.setItem("user", JSON.stringify(json));

        dispatch({ type: "LOGIN", payload: json });
        setIsLoading(false);
      }
   
  };
  return { Register1 , isLoading, error}
};
 