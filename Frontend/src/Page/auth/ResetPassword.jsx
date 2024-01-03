import React, { useEffect, useRef, useState } from "react";
import image from "../../assets/image/Awab Saif-logos_transparent.png";
import { FaInfoCircle } from "react-icons/fa";
import axios from "../../api/axios";
import { useParams } from "react-router-dom";


const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const RESETPASSWORD_URL = "api/user/resetpassword/";

export const ResetPassword = () => {
    
  const errRef = useRef();
  const token = useParams();

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [matchPassword, setMatchPassword] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);


  useEffect(() => {
    const result = PWD_REGEX.test(password);
    setValidPassword(result);
    const match = password === matchPassword;
    setValidMatch(match);
  }, [password, matchPassword]);

  useEffect(() => {
    setErrMsg("");
  }, [password, matchPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    //if button enabled with js hack

    const v2 = PWD_REGEX.test(password);
    if (!v2) {
      setErrMsg("دخول غير صالح");
      return;
    }
  console.log(token.resetToken);
    try {
      const response = await axios.put(
        RESETPASSWORD_URL+token.resetToken, 
        JSON.stringify({password,resetToken: token.resetToken  }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response.data);
      console.log(JSON.stringify(response));
      setSuccess(true);
    } catch (err) {
      if (!err?.response) {
        setErrMsg("الخادم لا يستجايب");
      } else {
        console.log(err);
        setErrMsg("فشل في التسجيل");
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
              تم إعادة تعيين كلمة المرور
            </h3>

            <p>
              <a
                className="items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4   rounded-full"
                href="/login"
              >
                تسجيل الدخول
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
              <h2 className="mb-4 text-lg font-medium">استعادة كلمة المرور</h2>
            </div>
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
              type="password"
              placeholder="كلمة المرور الجديدة"
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
                من 8 إلى 24 حرفًا.
                <br />
                يجب أن تتضمن أحرفًا كبيرة وصغيرة ورقمًا وحرفًا خاصًا.
                <br />
                الأحرف الخاصة المسموح بها:
                <span aria-label="exclamation mark">!</span>
                <span aria-label="at code">@</span>
                <span aria-label="hashtag">#</span>
                <span aria-label="dollarsign">$</span>
                <span aria-label="percent">%</span>
              </p>
            </div>
            <input
              className="w-full px-4 py-2 mt-4 text-sm border border-gray-300 border-solid rounded"
              placeholder="تاكيد كلمة المرور"
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
                يجب أن يتطابق مع حقل إدخال كلمة المرور .
              </p>
            </div>

            <div className="text-center m-4 md:text-left">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4   rounded-full">
                ارسال
              </button>
            </div>
          </form>
        </section>
      )}
    </>
  );
};
