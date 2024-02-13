import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "../../api/axios";

// API endpoint for confirming user account
const CONFIRM_ACCOUNT = "/api/users/confirm/";

// Component for verifying user account
export const Verify = () => {
  // Get token from URL parameters
  const { token } = useParams();

  // State variables for error message and verification status
  const [errMsg, setErrMsg] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  // Effect hook to verify token when component mounts or token changes
  useEffect(() => {
    if (token) {
      verifyToken(token); // Call verifyToken function if token exists
    } else {
      setErrMsg("Invalid verification link"); // Set error message if token is invalid
    }
  }, [token]);

  // Function to verify token
  const verifyToken = async (token) => {
    try {
      // Send GET request to confirm account with provided token
      const response = await axios.get(CONFIRM_ACCOUNT + token, { withCredentials: true });
      
      // If successful response received, set verification status to true
      setIsVerified(true);
    } catch (err) {
      // If error occurs, set error message based on response or default message
      setErrMsg(err.response?.data?.message || "Verification failed");
    }
  };

  return (
    // Render verification section
    <section className="flex items-center h-screen p-16 bg-gray-50 dark:bg-gray-700">
      <div className="container flex flex-col items-center ">
        <div className="flex flex-col gap-6 max-w-md text-center">
          {/* Conditional rendering based on verification status */}
          {isVerified ? (
            // If account is verified, display success message and sign-in link
            <>
              <h2 className="font-extrabold text-3xl text-gray-600">
                The account has been verified
              </h2>
              <Link
                to="/login"
                className="px-8 py-4 text-xl font-semibold rounded bg-fuchsia-500 hover:bg-fuchsia-700 text-white"
              >
                Sign In
              </Link>
            </>
          ) : (
            // If account verification failed, display error message
            <p className="font-extrabold text-3xl text-red-500">{errMsg}</p>
          )}
        </div>
      </div>
    </section>
  );
};

