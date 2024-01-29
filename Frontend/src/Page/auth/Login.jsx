import  { useEffect, useRef, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import image from "../../assets/image/IEM Ecommerce-logo.png";
import axios from "../../api/axios";
import Cookies from "cookie-universal";

const LOGIN_URL = "/api/users/login";
export const Login = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";


  const userRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const cookie = new Cookies();
  useEffect(() => {
    userRef.current.focus();
  }, []);
  useEffect(() => {
    setErrMsg("");
  }, [email, password]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ email, password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
        );
     
      const token = response?.data.token;
      const roles = response?.data.roles;
      setAuth({ email, password, roles, token});
      const tokencookie = cookie.set('Bearer', token);
      navigate(from, { replace: true });
    } catch (err) {
      if (!err?.response) {
        setErrMsg("Server not responding");
      } else {
        setErrMsg(err.response.data.message);
      }
      errRef.current.focus();
    }
  };

  return (
    
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
          <div className="mt-2 relative">
            <label htmlFor="password">Password</label>

            <input
              className="w-full px-4 py-2  text-sm border border-gray-300 border-solid rounded  outline-fuchsia-400"
              type={showPassword ? "text" : "password"}
              placeholder="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
            <div
              className="absolute inset-y-0 right-0 pr-2 mt-6 flex items-center text-sm leading-5 cursor-pointer"
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

          <div className="flex mt-4 text-sm font-semibold">
            <a
              className="text-fuchsia-600 hover:text-fuchsia-700 hover:underline hover:underline-offset-4"
              href="/forgotpassword"
            >
              Forgot your password?
            </a>
          </div>

          <div className="text-center m-4 md:text-right">
            <button className="bg-fuchsia-500 hover:bg-fuchsia-700 text-white font-bold py-2 px-4 disabled:bg-fuchsia-300  rounded-full">
              sign in
            </button>

            <div className="mt-4 text-sm font-semibold text-slate-500 md:text-left">
              Don't have an account?{" "}
              <a
                className="text-fuchsia-600 hover:underline hover:underline-offset-4"
                href="/register"
              >
                register
              </a>
            </div>
          </div>
        </form>
      </section>
    
  );
};
