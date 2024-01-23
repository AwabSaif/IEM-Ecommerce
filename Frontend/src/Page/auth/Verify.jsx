import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axios";

const CONFIRM_ACCOUNT = "/api/users/confirm/";

export const Verify = () => {
  const { token } = useParams(); // استخراج قيمة التوكن من رابط الاستدعاء
  const [errMsg, setErrMsg] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (token) {
      verifyToken(token);
    } else {
      setErrMsg("Invalid verification link");
    }
  }, [token]); // ضع token كتابع لـ useEffect لضمان تحديث الأثر فقط عندما يتغير

  const verifyToken = async (token) => {
    console.log(token);
    try {
      const response = await axios.post(CONFIRM_ACCOUNT + token );
      console.log(JSON.stringify(response?.data));
      setIsVerified(true);
      // Handle successful verification (e.g., redirect to a different page)
    } catch (err) {
      setErrMsg(err.response?.data?.message || "Verification failed");
    }
  };

  return (
    <section className="flex items-center h-screen p-16 bg-gray-50 dark:bg-gray-700">
      <div className="container flex flex-col items-center ">
        <div className="flex flex-col gap-6 max-w-md text-center">
          {isVerified ? (
            <>
              <h2 className="font-extrabold text-3xl text-gray-600">
                The account has been verified
              </h2>
              {/* You can use the link from your router library for navigation */}
              <a
                href="/signin"
                className="px-8 py-4 text-xl font-semibold rounded bg-fuchsia-500 hover:bg-fuchsia-700 text-white"
              >
                Sign In
              </a>
            </>
          ) : (
            <p className="font-extrabold text-3xl text-red-500">{errMsg}</p>
          )}
        </div>
      </div>
    </section>
  );
};

