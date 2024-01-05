import React, { useEffect, useRef, useState, useContext } from "react";
import image from "../../assets/image/IEM Ecommerce-logo.png";
import axios from "../../api/axios";
/* import AuthContext from "../../context/AuthProvider"; */

const LOGIN_URL = "/api/user/login";
export const Login = () => {
/*   const { setAuth } = useContext(AuthContext); */
  const userRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ email, password }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(JSON.stringify(response?.data));
      // console.log(JSON.stringify(response));
      const accessToken = response?.data.token;
      /* setAuth({email ,password ,roles , accessToken}); */
      setEmail("");
      setPassword("");
      setSuccess(true);
    } catch (err) {
      if (!err.response) {
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
            <h2 className="mb-4 text-lg font-medium">Signed in</h2>

            <p>
              <a
                className="items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4   rounded-full"
                href="/"
              >
                Go to the home page
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
            <h3 className="mb-4 text-lg font-medium ">Sign in</h3>
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
            <input
              className="w-full px-4 py-2 mt-4 text-sm border border-gray-300 border-solid rounded"
              placeholder="Email"
              type="email"
              id="email"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
            <input
              className="w-full px-4 py-2 mt-4 text-sm border border-gray-300 border-solid rounded"
              type="password"
              placeholder="Password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
            <div className="flex mt-4 text-sm font-semibold">
              <a
                className="text-blue-600 hover:text-blue-700 hover:underline hover:underline-offset-4"
                href="/forgotpassword"
              >
                Forgot your password?
              </a>
            </div>

            <div className="text-center m-4 md:text-right">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4   rounded-full">
                sign in
              </button>

              <div className="mt-4 text-sm font-semibold text-slate-500 md:text-left">
                Don't have an account?{" "}
                <a
                  className="text-red-600 hover:underline hover:underline-offset-4"
                  href="/register"
                >
                  register
                </a>
              </div>
            </div>
          </form>
        </section>
      )}
    </>
  );
};
