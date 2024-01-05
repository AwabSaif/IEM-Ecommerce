import { useEffect, useRef, useState } from "react";
import { useContext } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import axios from "../../api/axios";
import image from "../../assets/image/IEM Ecommerce-logo.png";
import { FaInfoCircle } from "react-icons/fa";

const USER_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = "/api/user/register";

export const Register = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");
  const [validMail, setvalidMail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [matchPassword, setMatchPassword] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();
  console.log(useAuthContext());

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    const result = USER_REGEX.test(email);
    setvalidMail(result);
  }, [email]);

  useEffect(() => {
    const result = PWD_REGEX.test(password);
    setValidPassword(result);
    const match = password === matchPassword;
    setValidMatch(match);
  }, [password, matchPassword]);

  useEffect(() => {
    setErrMsg("");
  }, [name, email, password, matchPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    //if button enabled with js hack
    const v1 = USER_REGEX.test(email);
    const v2 = PWD_REGEX.test(password);
    if (!v1 || !v2) {
      setErrMsg("Invalid login");
      return;
    }
    try {
      setIsLoading(true);
      setErrMsg(null);
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
      console.log(response.datatoken);
      // const accessToken = response?.data.token;
      const json = await response.json();

      setSuccess(true);
      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(json));

        dispatch({ type: "LOGIN", payload: json });
        setIsLoading(false);
      }
    } catch (err) {
      if (!err.response) {
        setIsLoading(false);
        setErrMsg("Server not responding");
      } else {
        setIsLoading(false);
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
            <h3 className="mb-4 text-lg font-medium">Account created</h3>

            <p>
              <a
                className="items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4   rounded-full"
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
            <h2 className="text-gray-900 font-bold py-2 px-4 ">Register</h2>
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
              className="w-full px-4 py-2 text-sm border border-gray-300 border-solid rounded"
              placeholder="Full Name"
              type="text"
              id="name"
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              className="w-full px-4 py-2 mt-4 text-sm border border-gray-300 border-solid rounded"
              placeholder="Email"
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
            <div
              className={
                emailFocus && email && !validMail
                  ? "bg-orange-100  border-orange-500 text-orange-700 p-4"
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

            <input
              className="w-full px-4 py-2 mt-4 text-sm border border-gray-300 border-solid rounded"
              type="password"
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
            <input
              className="w-full px-4 py-2 mt-4 text-sm border border-gray-300 border-solid rounded"
              placeholder="confirm password"
              type="password"
              id="confirm-Pass"
              onChange={(e) => setMatchPassword(e.target.value)}
              required
              aria-invalid={validMatch ? "false" : "true"}
              aria-describedby="confirmnote"
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
            />
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

            <div className="mt-4 text-sm font-semibold text-slate-500 md:text-left">
              Do you have account?{" "}
              <a
                className="text-red-600 hover:underline hover:underline-offset-4"
                href="/login"
              >
                sign in
              </a>
            </div>
            <div className="text-center m-4 md:text-right">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4   rounded-full"
                disabled={ 
                  !validMail || !validPassword || !validMatch  || isLoading ? true : false
                }
              >
                register
              </button>
            </div>
          </form>
        </section>
      )}
    </>
  );
};
