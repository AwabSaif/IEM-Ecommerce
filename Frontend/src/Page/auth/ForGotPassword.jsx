import React, { useEffect, useRef, useState, useContext } from "react";
import image from "../../assets/image/IEM Ecommerce-logo.png";
import axios from "../../api/axios";


const FORGOTPASSWORD_URL = "/api/users/forgotpassword";

export const ForGotPassword = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState("");

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);
  useEffect(() => {
    setErrMsg("");
  }, [email]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        FORGOTPASSWORD_URL,
        JSON.stringify({ email }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(JSON.stringify(response?.data));
      

      setEmail("");

      setSuccess(true);
    }  catch (err) {
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
        <section className="flex flex-col items-center justify-center h-screen mx-5 my-2 space-y-10 md:flex-row md:space-y-0 md:space-x-16 md:mx-0 md:my-0">
          <div className="flex-row  items-center">
            <h3 className="mb-4 text-lg font-medium">
              Password reset has been sent
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
            <img src={image} alt={image} />
          </div>
          <form onSubmit={handleSubmit} className="max-w-sm md:w-1/3">
            <h3 className="mb-4 text-lg font-medium ">Forgot password</h3>
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
            <div >
              <label htmlFor="email">Email</label>
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

            <div className="mt-4 text-sm font-semibold text-slate-500 ">
              Go back to Login page {"  "}
              <a
                className="text-red-600 hover:underline hover:underline-offset-4"
                href="/login"
              >
                sign in
              </a>
            </div>

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
