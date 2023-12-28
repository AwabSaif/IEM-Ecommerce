import React, { useEffect, useRef, useState, useContext } from "react";
import image from "../../assets/image/Awab Saif-logos_transparent.png";
import axios from "../../api/axios";
import AuthContext from "../../context/AuthProvider";

const LOGIN_URL = "/api/user/login";
export const Login = () => {
  const { setAuth } = useContext(AuthContext);
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
          headers: {  "Content-Type": "application/json" },
         
        }
      );
      console.log(JSON.stringify(response?.data));
      // console.log(JSON.stringify(response));
      const accessToken = response?.data.token
      const roles =response?.data.roles;
      setAuth({email ,password ,roles , accessToken});
      setEmail("");
      setPassword("");
      setSuccess(true);
    } catch (err) {
      if(!err?.response){
        setErrMsg('الخادم لا يستجايب')
      }else if (err.response?.status === 400) {
        setErrMsg('اسم المستخدم أو كلمة المرور غير صحيح');
      } else if (err.response?.status === 401) {
        setErrMsg('لم يتم العثور على المستخدم! الرجاء التسجيل');
      } else {
      setErrMsg('فشل تسجيل الدخول');
      }
      errRef.current.focus();
    };
  };

  return (
    <>
      {success ? (
        <section className="flex flex-col items-center justify-center h-screen mx-5 my-2 space-y-10 md:flex-row md:space-y-0 md:space-x-16 md:mx-0 md:my-0">
          <div className="flex-row  items-center">
            <h2 className="mb-4 text-lg font-medium">تم تسجيل الدخول</h2>

            <p>
              <a
                className="items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4   rounded-full"
                href="/"
              >
                اذهب للصفحة الرئيسية
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
              placeholder="البريد الاكتروني"
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
              placeholder="كلمة المرور"
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
                نسيت كلمة المرور؟
              </a>
            </div>

            <div className="text-center m-4 md:text-left">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4   rounded-full">
                تسجيل الدخول
              </button>

              <div className="mt-4 text-sm font-semibold text-slate-500 md:text-right">
                ليس لديك حساب؟{" "}
                <a
                  className="text-red-600 hover:underline hover:underline-offset-4"
                  href="/register"
                >
                  تسجيل
                </a>
              </div>
            </div>
          </form>
        </section>
      )}
    </>
  );
};
