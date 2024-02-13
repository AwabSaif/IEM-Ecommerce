import { useEffect, useRef, useState } from "react";
import axios from "../../api/axios";
import image from "../../assets/image/IEM Ecommerce-logo.png";
import { FaInfoCircle, FaEye, FaEyeSlash } from "react-icons/fa";

// Regular expressions for email and password validation
const USER_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = "/api/users/register";

export const Register = () => {
  // Refs for focusing on elements and displaying error messages
  const userRef = useRef();
  const errRef = useRef();

  // State variables for form fields and validation
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [validMail, setvalidMail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [matchPassword, setMatchPassword] = useState("");
  const [showMatchPassword, setShowMatchPassword] = useState(false);
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  // Focus on the username input field on component mount
  useEffect(() => {
    userRef.current.focus();
  }, []);

  // Validate email format when email state changes
  useEffect(() => {
    const result = USER_REGEX.test(email);
    setvalidMail(result);
  }, [email]);

  // Validate password format and match when password state changes
  useEffect(() => {
    const result = PWD_REGEX.test(password);
    setValidPassword(result);
    const match = password === matchPassword;
    setValidMatch(match);
  }, [password, matchPassword]);

  // Reset error message when any form field changes
  useEffect(() => {
    setErrMsg("");
  }, [username, email, phone, password, matchPassword]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email and password formats
    const v1 = USER_REGEX.test(email);
    const v2 = PWD_REGEX.test(password);
    if (!v1 || !v2) {
      setErrMsg("Invalid Entry");
      return;
    }

    try {
      setErrMsg(null);
      // Send registration data to server
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify({
          name: username,
          email,
          phone,
          password,
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setSuccess(true); // Set success state to true after successful registration
    } catch (err) {
      // Handle server or validation errors
      if (!err?.response) {
        setErrMsg("Server not responding");
      } else {
        setErrMsg(err.response.data.message);
      }
      errRef.current.focus();
    }
  };

  return (
    <>
      {success ? (
        // Display success message after registration
        <section className="flex items-center justify-center h-screen">
          <div className="flex items-center justify-center border rounded-lg shadow relative max-w-lg">
            <div className="p-6 pt-0 text-center">
              <h3 className="text-xl font-normal text-gray-500  mx-15 mt-20 mb-10 ">
                Check your email to verify account
              </h3>
              <a
                href="/login"
                className="bg-fuchsia-500 hover:bg-fuchsia-700 text-white font-bold py-2 px-4 disabled:bg-fuchsia-300  rounded-full "
              >
                sign in
              </a>
            </div>
          </div>
        </section>
      ) : (
        // Display registration form
        <section className="flex flex-col items-center justify-center h-screen mx-5 my-2 space-y-10 md:flex-row md:space-y-0 md:space-x-16 md:mx-0 md:my-0">
          <div className="max-w-sm md:w-1/3">
            <img src={image} alt={image} />
          </div>
          <form onSubmit={handleSubmit} className="max-w-sm md:w-1/3">
            <h2 className="mb-4 text-lg font-medium">Sing Up</h2>
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
            {/* User Name Input */}
            <div>
              <label htmlFor="username">User Name</label>
              <input
                className="w-full px-4 py-2 text-sm border border-gray-300 border-solid rounded outline-fuchsia-400"
                type="text"
                id="username"
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="User Name"
              />
            </div>
            {/* Email Input */}
            <div className="mt-2">
              <label htmlFor="email">Email</label>
              <input
                className="w-full px-4 py-2 text-sm border border-gray-300 border-solid rounded  outline-fuchsia-400"
                placeholder=" user@example.com"
                type="email"
                id="email"
                ref={userRef}
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-invalid={validMail ? "false" : "true"}
                aria-describedby="uidnote"
                onFocus={() => setEmailFocus(true)}
                onBlur={() => setEmailFocus(false)}
              />
              {/* Email validation message */}
              <div
                className={
                  emailFocus && email && !validMail
                    ? "bg-fuchsia-100  border-fuchsia-500  text-fuchsia-700 p-4"
                    : "hidden"
                }
              >
                <p id="uidnote">
                  <FaInfoCircle />
                  Must contain @
                  <br />
                  user@example.com
                </p>
              </div>
            </div>
            {/* Phone Input */}
            <div className="mt-2 ">
              <label htmlFor="phone">Phone Number</label>
              <input
                className="flex-1 w-full px-4 py-2 text-sm border border-gray-300 border-solid rounded-r  outline-fuchsia-400"
                placeholder="05506865"
                type="tel"
                id="phone"
                autoComplete="off"
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            {/* Password Input */}
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
                {/* Toggle password visibility */}
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
              {/* Password validation message */}
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
                  Allowed special characters: !@#$%
                </p>
              </div>
            </div>
            {/* Confirm Password Input */}
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
                {/* Toggle confirm password visibility */}
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
              {/* Confirm password validation message */}
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

            {/* Link to Sign In */}
            <div className="mt-4 text-sm font-semibold text-slate-500 md:text-left">
              Do you have account?{" "}
              <a
                className="text-fuchsia-600 hover:underline hover:underline-offset-4"
                href="/login"
              >
                sign in
              </a>
            </div>
            {/* Submit Button */}
            <div className="text-center m-4 md:text-right">
              <button
                className="bg-fuchsia-500 hover:bg-fuchsia-700 text-white font-bold py-2 px-4 disabled:bg-fuchsia-300  rounded-full"
                disabled={
                  !validMail || !validPassword || !validMatch ? true : false
                }
              >
                Sing Up
              </button>
            </div>
          </form>
        </section>
      )}
    </>
  );
};
