import React, { useEffect, useRef, useState } from "react";
import image from "../../assets/image/IEM Ecommerce-logo.png";
import { FaInfoCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "../../api/axios";

import { useParams } from "react-router-dom";

// Regular expression to validate password format
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

// API endpoint for resetting password
const RESETPASSWORD_URL = "api/users/resetpassword/";

export const ResetPassword = () => {
  const errRef = useRef(); // Reference for error message element
  const token = useParams(); // Get token from URL parameters

  const [password, setPassword] = useState(""); // State for password input
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [validPassword, setValidPassword] = useState(false); // State to track password validity
  const [passwordFocus, setPasswordFocus] = useState(false); // State to track password input focus

  const [matchPassword, setMatchPassword] = useState(""); // State for confirm password input
  const [showMatchPassword, setShowMatchPassword] = useState(false); // State to toggle confirm password visibility
  const [validMatch, setValidMatch] = useState(false); // State to track confirm password validity
  const [matchFocus, setMatchFocus] = useState(false); // State to track confirm password input focus

  const [errMsg, setErrMsg] = useState(""); // State for error message
  const [success, setSuccess] = useState(false); // State to track successful password reset

  // Effect to validate password format and match
  useEffect(() => {
    const result = PWD_REGEX.test(password); // Check if password matches regex pattern
    setValidPassword(result); // Set password validity state
    const match = password === matchPassword; // Check if password matches confirm password
    setValidMatch(match); // Set confirm password validity state
  }, [password, matchPassword]);

  // Effect to clear error message on password or confirm password change
  useEffect(() => {
    setErrMsg(""); // Clear error message
  }, [password, matchPassword]);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    const v2 = PWD_REGEX.test(password); // Validate password format
    if (!v2) {
      setErrMsg("Invalid login"); // Set error message for invalid password format
      return;
    }

    try {
      // Send reset password request to API
      const response = await axios.put(
        RESETPASSWORD_URL + token.resetToken,
        JSON.stringify({ password, resetToken: token.resetToken }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response.data); // Log response data
      console.log(JSON.stringify(response)); // Log response
      setSuccess(true); // Set success state to true
    } catch (err) {
      if (!err?.response) {
        setErrMsg("Server not responding"); // Set error message for server not responding
      } else {
        console.log(err); // Log error
        setErrMsg("Failed to register"); // Set error message for failed registration
      }
      errRef.current.focus(); // Focus on error message element
    }
  };

  return (
    <>
      {success ? (
        <section className="flex flex-col items-center justify-center h-screen mx-5 my-2 space-y-10 md:flex-row md:space-y-0 md:space-x-16 md:mx-0 md:my-0">
          <div className="flex-row  items-center">
            <h3 className="mb-4 text-lg font-medium">
              Your password has been reset
            </h3>

            <p>
              <a
                className="items-center bg-fuchsia-500 hover:bg-fuchsia-700 text-white font-bold py-2 px-4 disabled:bg-fuchsia-300  rounded-full"
                href="/login"
              >
                sign in
              </a>
            </p>
          </div>
        </section>
      ) : (
        <section className="flex flex-col items-center justify-center h-screen mx-5 my-2 space-y-10 md:flex-row md:space-y-0 md:space-x-16 md:mx-0 md:my-0">
          <div className="max-w-sm md:w-1/3">
            <img src={image} alt="Sample image" />
          </div>
          <form onSubmit={handleSubmit} className="max-w-sm md:w-1/3">
            <div className="flex-row  items-center">
              <h2 className="mb-4 text-lg font-medium">Password Reset</h2>
            </div>
            <div
              ref={errRef}
              className={
                errMsg
                  ? "bg-fuchsia-100 border border-fuchsia-400 text-fuchsia-700 px-2 py-2 mb-2  rounded relative"
                  : "hidden"
              }
              aria-live="assertive"
              role="alert"
            >
              <span className="block sm:inline">{errMsg}</span>
            </div>
            <div className="mt-2 " x-data="{ show: true }">
              <label htmlFor="password">Password</label>
              <div className="relative">
                <input
                  className="w-full px-4 py-2  text-sm border border-gray-300 border-solid rounded  outline-fuchsia-400"
                  type={showPassword ? "text" : "password"}
                  placeholder="password"
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  aria-invalid={validPassword ? "false" : "true"}
                  aria-describedby="pwdnote"
                  onFocus={() => setPasswordFocus(true)}
                  onBlur={() => setPasswordFocus(false)}
                />
                <div
                  className="absolute  inset-y-0 right-0 pr-2  flex items-center text-sm  leading-5 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <span className="text-xl text-fuchsia-500">
                      <FaEyeSlash />
                    </span>
                  ) : (
                    <span className="text-xl text-fuchsia-500">
                      <FaEye />
                    </span>
                  )}
                </div>
              </div>

              <div
                id="pwdnote"
                className={
                  passwordFocus && !validPassword
                    ? "bg-fuchsia-100 sm:w-72 md:w-[269px] items:center lg:w-full border-fuchsia-500 text-fuchsia-700 p-4"
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
                  Allowed special characters: ! @ # $ %
                </p>
              </div>
            </div>
            <div className="mt-2">
              <label htmlFor="confirm-Pass">Confirm Password</label>
              <div className="relative">
                <input
                  className="w-full px-4 py-2 text-sm border border-gray-300 border-solid rounded  outline-fuchsia-400"
                  placeholder="confirm password"
                  type={showMatchPassword ? "text" : "password"}
                  id="confirm-Pass"
                  onChange={(e) => setMatchPassword(e.target.value)}
                  required
                  aria-invalid={validMatch ? "false" : "true"}
                  aria-describedby="confirmnote"
                  onFocus={() => setMatchFocus(true)}
                  onBlur={() => setMatchFocus(false)}
                />
                <div
                  className="absolute inset-y-0 right-0 pr-2  flex items-center text-sm leading-5 cursor-pointer"
                  onClick={() => setShowMatchPassword(!showMatchPassword)}
                >
                  {showMatchPassword ? (
                    <span className="text-xl text-fuchsia-500">
                      <FaEyeSlash />
                    </span>
                  ) : (
                    <span className="text-xl text-fuchsia-500">
                      <FaEye />
                    </span>
                  )}
                </div>
              </div>
              <div
                id="confirmnote"
                className={
                  matchFocus && !validMatch
                    ? "bg-fuchsia-100  border-fuchsia-500 text-fuchsia-700 p-4"
                    : "hidden"
                }
              >
                <p>
                  <FaInfoCircle />
                  Must match the password entry field.
                </p>
              </div>
            </div>

            <div className="text-center m-4 md:text-right">
              <button className="bg-fuchsia-500 hover:bg-fuchsia-700 text-white font-bold py-2 px-4 disabled:bg-fuchsia-300  rounded-full">
                Submit
              </button>
            </div>
          </form>
        </section>
      )}
    </>
  );
};
