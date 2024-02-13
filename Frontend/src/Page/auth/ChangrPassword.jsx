import React, { useEffect, useRef, useState } from "react";
import image from "../../assets/image/IEM Ecommerce-logo.png";
import { FaInfoCircle } from "react-icons/fa";
import axios from "../../api/axios";
import { useParams } from "react-router-dom";

// Regular expression for password validation
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

// API endpoint for changing password
const CHANGEPASSWORD_URL = "api/user/changepassword";

export const ChangrPassword = () => {
  // Ref for error message
  const errRef = useRef();
  // Get token from URL parameters
  const token = useParams();

  // State variables for old password, new password, and match password
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [matchPassword, setMatchPassword] = useState("");

  // State variables for password validation and focus
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  // State variables for error message and success status
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  // Effect to validate password and match password
  useEffect(() => {
    const result = PWD_REGEX.test(password);
    setValidPassword(result);
    const match = password === matchPassword;
    setValidMatch(match);
  }, [password, matchPassword]);

  // Effect to clear error message when password changes
  useEffect(() => {
    setErrMsg("");
  }, [password, matchPassword]);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password with regex
    const v2 = PWD_REGEX.test(password);
    if (!v2) {
      setErrMsg("Invalid password format");
      return;
    }

    try {
      // Send password change request to API
      const response = await axios.patch(
        CHANGEPASSWORD_URL,
        JSON.stringify({ oldPassword, password }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      // Log response and set success status
      console.log(response.data);
      setSuccess(true);
    } catch (err) {
      // Handle errors from API response
      if (!err?.response) {
        setErrMsg("Server not responding");
      } else {
        console.log(err);
        setErrMsg("Error changing password");
      }
      // Focus on error message
      errRef.current.focus();
    }
  };

  return (
    <>
      {/* PageMenu component */}
      {/* Conditional rendering based on success status */}
      {success ? (
        <section className="flex flex-col items-center justify-center h-screen mx-5 my-2 space-y-10 md:flex-row md:space-y-0 md:space-x-16 md:mx-0 md:my-0">
          <div className="flex-row  items-center">
            <h2 className="mb-4 text-lg font-medium">
              Your password has been reset
            </h2>
            <p>
              <a
                className="items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4   rounded-full"
                href="/login"
              >
                Sign in
              </a>
            </p>
          </div>
        </section>
      ) : (
        <section className="flex  flex-col  mb-16 lg:mb-0 items-center justify-center h-screen mx-5 my-2 space-y-10 md:flex-row md:space-y-0 md:space-x-16 md:mx-0 md:my-0">
          <div className="max-w-sm md:w-1/3">
            <img src={image} alt="Sample image" />
          </div>
          <form onSubmit={handleSubmit} className="max-w-sm md:w-1/3">
            <div className="flex-row  items-center">
              <h3 className="mb-4 text-lg font-medium">Change Password</h3>
            </div>
            {/* Error message display */}
            <div
              ref={errRef}
              className={
                errMsg
                  ? "bg-red-100 border border-red-400 text-red-700 px-2 py-2 mb-2  rounded relative"
                  : "hidden"
              }
              aria-live="assertive"
              role="alert"
            >
              <span className="block sm:inline">{errMsg}</span>
            </div>
            {/* Old password input */}
            <input
              className="w-full px-4 py-2 mt-4 text-sm border border-gray-300 border-solid rounded"
              type="password"
              placeholder="Old Password"
              id="oldPassword"
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
            {/* New password input */}
            <input
              className="w-full px-4 py-2 mt-4 text-sm border border-gray-300 border-solid rounded"
              type="password"
              placeholder="New Password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-invalid={validPassword ? "false" : "true"}
              aria-describedby="pwdnote"
              onFocus={() => setPasswordFocus(true)}
              onBlur={() => setPasswordFocus(false)}
            />
            {/* Password strength indicator */}
            <div
              id="pwdnote"
              className={
                passwordFocus && !validPassword
                  ? "bg-orange-100  border-orange-500 text-orange-700 p-4"
                  : "hidden"
              }
            >
              <p>
                <FaInfoCircle />
                8 to 24 characters.
                <br />
                Must include uppercase and lowercase letters, a number, and a
                special character.
                <br />
                Allowed special characters:
                <span aria-label="exclamation mark">!</span>
                <span aria-label="at code">@</span>
                <span aria-label="hashtag">#</span>
                <span aria-label="dollarsign">$</span>
                <span aria-label="percent">%</span>
              </p>
            </div>
            {/* Confirm password input */}
            <input
              className="w-full px-4 py-2 mt-4 text-sm border border-gray-300 border-solid rounded"
              placeholder="Confirm Password"
              type="password"
              id="confirm-Pass"
              onChange={(e) => setMatchPassword(e.target.value)}
              required
              aria-invalid={validMatch ? "false" : "true"}
              aria-describedby="confirmnote"
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
            />
            {/* Confirm password note */}
            <div
              id="confirmnote"
              className={
                matchFocus && !validMatch
                  ? "bg-orange-100  border-orange-500 text-orange-700 p-4"
                  : "hidden"
              }
            >
              <p>
                <FaInfoCircle />
                Must match the password entry field.
              </p>
            </div>
            {/* Submit button */}
            <div className="text-center m-4 md:text-right">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4   rounded-full">
                Submit
              </button>
            </div>
          </form>
        </section>
      )}
    </>
  );
};
