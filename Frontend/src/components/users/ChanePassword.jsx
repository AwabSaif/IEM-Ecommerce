import React, { useEffect, useRef, useState } from "react";
import { FaInfoCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "../../api/axios";
import { useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const CHANGEPASSWORD_URL = "/api/users/changepassword";
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

export const ChanePassword = () => {
  const { auth } = useAuth();
  const token = auth.token;
  //id from link
  const { id } = useParams();

  //set error
  const errRef = useRef();

  //message
  const [errMsg, setErrMsg] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  //form
  const [oldpassword, setOldpassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [matchPassword, setMatchPassword] = useState("");

  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);
  const [showMatchPassword, setShowMatchPassword] = useState(false);

  useEffect(() => {
    setErrMsg("");
  }, [password, matchPassword]);

  useEffect(() => {
    // Validate password and match password on change
    const result = PWD_REGEX.test(password);
    setValidPassword(result);
    const match = password === matchPassword;
    setValidMatch(match);
  }, [password, matchPassword]);

  //change password
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setErrMsg(null);
      const formFile = {
        _id: id,
        oldpassword,
        password,
      };
      const response = await axios.patch(CHANGEPASSWORD_URL, formFile, {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
        withCredentials: true,
      });
      // console.log(response);
      setSuccessMessage("Password updated successfully");
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
    <form onSubmit={handleSubmit}>
      <div className="mt-16 pt-3">
        {/* Error message */}
        <div
          ref={errRef}
          className={
            errMsg
              ? "bg-fuchsia-100 border border-fuchsia-400 text-fuchsia-700 px-2 py-2 mb-2 rounded relative"
              : "hidden"
          }
          aria-live="assertive"
          role="alert"
        >
          <span className="block sm:inline">{errMsg}</span>
        </div>
        {/* Success message */}
        {successMessage && (
          <div className="bg-fuchsia-100 border border-fuchsia-400 text-fuchsia-700 px-2 py-2 mb-2 rounded relative">
            {successMessage}
          </div>
        )}
        <div className="-mx-3 flex flex-wrap">
          <div className="w-full px-3 sm:w-1/2">
            <div className="mb-5 relative">
              {/* Old Password Input */}
              <label
                htmlFor="oldpassword"
                className="mb-3 block text-base font-medium"
              >
                Old Password
              </label>
              <input
                onChange={(e) => setOldpassword(e.target.value)}
                type={showOldPassword ? "text" : "password"}
                name="oldpassword"
                id="oldpassword"
                value={oldpassword}
                placeholder="password"
                required
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium outline-none focus:border-fuchsia-400 focus:shadow-md"
              />
              {/* Toggle Show/Hide Old Password */}
              <div
                className="absolute inset-y-0 right-0 pr-2 mt-8 flex items-center text-sm leading-5 cursor-pointer"
                onClick={() => setShowOldPassword(!showOldPassword)}
              >
                {showOldPassword ? (
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
          </div>
          <div className="w-full px-3 sm:w-1/2">
            <div className="mb-5 relative">
              {/* Change Password Button */}
              <button className="mt-9 hover:shadow-htmlForm w-full rounded-md bg-fuchsia-500 py-3 px-8 text-center text-base font-semibold text-white outline-none">
                Change Password
              </button>
            </div>
          </div>
          <div className="w-full px-3 sm:w-1/2">
            <div>
              <div className="mb-5 relative">
                {/* New Password Input */}
                <label
                  htmlFor="password"
                  className="mb-3 block text-base font-medium"
                >
                  New Password
                </label>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={password}
                  placeholder="password"
                  required
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium outline-none focus:border-fuchsia-400 focus:shadow-md"
                  aria-invalid={validPassword ? "false" : "true"}
                  aria-describedby="pwdnote"
                  onFocus={() => setPasswordFocus(true)}
                  onBlur={() => setPasswordFocus(false)}
                />
                {/* Toggle Show/Hide New Password */}
                <div
                  className="absolute inset-y-0 right-0 pr-2 mt-8 flex items-center text-sm leading-5 cursor-pointer"
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
                {/* Password Requirements */}
                <p>
                  <FaInfoCircle />
                  8 to 24 characters.
                  <br />
                  Must include uppercase and lowercase letters,a number, and a
                  special character.
                  <br />
                  Allowed special characters: ! @ # $ %
                </p>
              </div>
            </div>
          </div>
          <div className="w-full px-3 sm:w-1/2">
            <div className="mb-5 relative">
              {/* Confirm New Password Input */}
              <label
                htmlFor="confirm-Pass"
                className="mb-3 block text-base font-medium"
              >
                Confirm New Password
              </label>
              <input
                type={showMatchPassword ? "text" : "password"}
                name="confirm-Pass"
                id="confirm-Pass"
                value={matchPassword}
                placeholder="password"
                onChange={(e) => setMatchPassword(e.target.value)}
                required
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium outline-none focus:border-fuchsia-400 focus:shadow-md"
                onFocus={() => setMatchFocus(true)}
                onBlur={() => setMatchFocus(false)}
              />
              {/* Toggle Show/Hide Confirm New Password */}
              <div
                className="absolute inset-y-0 right-0 pr-2 mt-8 flex items-center text-sm leading-5 cursor-pointer"
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
              {/* Confirm Password Match Error */}
              <p>
                <FaInfoCircle />
                Must match the password entry field.
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
