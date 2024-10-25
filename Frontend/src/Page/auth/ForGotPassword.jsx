import React, { useEffect, useRef, useState, useContext } from "react";
import image from "../../assets/image/Awab Saif-logos_transparent.png";
import axios from "../../api/axios";

const FORGOTPASSWORD_URL = "/api/users/forgotpassword"; // Define URL for password reset

export const ForGotPassword = () => {
  const userRef = useRef(); // Reference to email input field
  const errRef = useRef(); // Reference to error message div

  const [email, setEmail] = useState(""); // State for email input
  const [errMsg, setErrMsg] = useState(""); // State for error message
  const [success, setSuccess] = useState(false); // State for successful password reset

  // Focus on email input field on component mount
  useEffect(() => {
    userRef.current.focus();
  }, []);

  // Clear error message when email input changes
  useEffect(() => {
    setErrMsg("");
  }, [email]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      // Send POST request to reset password
      const response = await axios.post(
        FORGOTPASSWORD_URL,
        JSON.stringify({ email }), // Send email in request body
        {
          headers: { "Content-Type": "application/json" }, // Set request headers
        }
      );
      console.log(JSON.stringify(response?.data)); // Log response data

      setEmail(""); // Clear email input
      setSuccess(true); // Set success state to true
    } catch (err) {
      // Handle errors
      if (!err?.response) {
        setErrMsg("Server not responding"); // Set error message for server not responding
      } else {
        setErrMsg(err.response.data.message); // Set error message from response data
      }
      errRef.current.focus(); // Focus on error message div
    }
  };

  // Render password reset confirmation or form for resetting password
  return (
    <>
      {success ? (
        <section className="flex items-center justify-center h-screen">
          {/* Render password reset confirmation */}
          <div className="flex items-center justify-center border rounded-lg shadow relative max-w-lg">
            <div className="p-6 pt-0 text-center">
              <h3 className="text-xl font-normal text-gray-500  mx-20 mt-20 mb-10 ">
                Password reset has been sent
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
        <section className="flex flex-col items-center justify-center h-screen mx-5 my-2 space-y-10 md:flex-row md:space-y-0 md:space-x-16 md:mx-0 md:my-0">
          {/* Render password reset form */}
          <div className="max-w-sm md:w-1/3">
            <img src={image} alt={image} />
          </div>
          <form onSubmit={handleSubmit} className="max-w-sm md:w-1/3">
            <h3 className="mb-4 text-lg font-medium ">Forgot password</h3>
            {/* Render error message if exists */}
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
            <div>
              <label htmlFor="email">Email</label>
              {/* Render email input field */}
              <input
                className="w-full px-4 py-2 text-sm border border-gray-300 border-solid rounded  outline-fuchsia-400"
                placeholder=" user@example.com"
                type="email"
                id="email"
                ref={userRef}
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </div>

            {/* Render link to login page */}
            <div className="mt-4 text-sm font-semibold text-slate-500 ">
              Go back to Login page {"  "}
              <a
                className="text-fuchsia-600 hover:underline hover:underline-off set-4"
                href="/login"
              >
                sign in
              </a>
            </div>

            {/* Render submit button */}
            <div className="text-center m-4 md:text-right">
              <button className="bg-fuchsia-500 hover:bg-fuchsia-700 text-white font-bold py-2 px-4 disabled:bg-fuchsia-300  rounded-full">
                send
              </button>
            </div>
          </form>
        </section>
      )}
    </>
  );
};
