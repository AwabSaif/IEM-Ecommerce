import React, { useEffect, useRef, useState } from "react";
import { FaCheck, FaInfoCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import {  useNavigate, useParams } from "react-router-dom";
import { IoCloseCircleOutline } from "react-icons/io5";
const EDITUSER_URL = "/api/users/";

export const UpdateUser = () => {
  // Authentication
  const { auth } = useAuth();
  const token = auth.token;

  // Get user ID from URL params
  const { id } = useParams();

  // Reference to error message element
  const errRef = useRef();

  // Navigation hook
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [user, setUser] = useState({});
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [matchPassword, setMatchPassword] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);
  const [showMatchPassword, setShowMatchPassword] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [verified, setVerified] = useState(false);
  const [street, setStreet] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [apartment, setApartment] = useState("");

  // Error and success messages
  const [errMsg, setErrMsg] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(EDITUSER_URL + id, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
           
        });
        setUser(response.data);
        setAdmin(response.data.isAdmin);
      } catch (err) {
        setErrMsg("Failed to fetch user");
      }
    };

    if (!user.id) {
      fetchUser();
    }
  }, [user.id]);

  // Set form fields with user data
  useEffect(() => {
    if (user.id) {
      setUsername(user.name);
      setEmail(user.email);
      setPhone(user.phone);
      setAdmin(user.isAdmin);
      setVerified(user.verified);
      setCountry(user.country);
      setCity(user.city);
      setStreet(user.street);
      setZip(user.zip);
      setApartment(user.apartment);
    }
  }, [user]);

  // Reset error message on input change
  useEffect(() => {
    setErrMsg("");
  }, [username, email, phone, password, matchPassword]);

  // Check if password matches confirm password
  useEffect(() => {
    const match = password === matchPassword;
    setValidMatch(match);
  }, [password, matchPassword]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      setErrMsg(null);
      const formFile = {
        _id: id,
        name: username,
        email,
        phone,
        isAdmin: admin,
        password,
        verified,
        street,
        country,
        city,
        zip,
        apartment,
      };

      const response = await axios.put(EDITUSER_URL + id, formFile, {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
         
      });
      setIsLoading(false);
      setSuccessMessage("User updated successfully");
    } catch (err) {
      setIsLoading(false);
      if (!err?.response) {
        setErrMsg("Server not responding");
      } else {
        setErrMsg(err.response.data.message);
      }
      errRef.current.focus();
    }
  };

  return (
    <div className="flex items-center justify-center p-12">
      <div className="mx-auto w-full max-w-[850px] bg-white">
        <div className="relative ">
          <button
            className={`absolute cursor-pointer  white  -right-1 rounded-full  `}
            onClick={handleGoBack}
          >
            <span className="text-fuchsia-500 text-2xl">
              <IoCloseCircleOutline />
            </span>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <h3 className="mb-4  -ml-10 text-2xl font-medium ">Edit user</h3>
          <div
            ref={errRef}
            className={
              errMsg
                ? "bg-fuchsia-100 border  border-fuchsia-400 text-fuchsia-700 px-2 py-2 mb-2  rounded relative"
                : "hidden"
            }
            aria-live="assertive"
            role="alert"
          >
            <span className="block sm:inline">{errMsg}</span>
          </div>
          {successMessage && (
            <div className=" bg-fuchsia-100 border border-fuchsia-400 text-fuchsia-700 px-2 py-2 mb-2  rounded relative">
              {successMessage}
            </div>
          )}
          <div className="mb-5">
            <label
              htmlFor="username"
              className="mb-3 block text-base font-medium"
            >
              User Name
            </label>

            <input
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              name="username"
              id="username"
              value={username}
              placeholder="User Name"
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium  outline-none focus:border-fuchsia-400  focus:shadow-md"
            />
          </div>
          <div className="mb-5">
            <label htmlFor="email" className="mb-3 block text-base font-medium">
              Email
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              name="email"
              id="email"
              value={email}
              placeholder="Enter your email"
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium  outline-none focus:border-fuchsia-400  focus:shadow-md"
            />
          </div>
          <div className="mb-5">
            <label htmlFor="phone" className="mb-3 block text-base font-medium">
              Phone Number
            </label>
            <input
              onChange={(e) => setPhone(e.target.value)}
              type="text"
              name="phone"
              id="phone"
              value={phone}
              placeholder="Enter your phone number"
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium  outline-none focus:border-fuchsia-400  focus:shadow-md"
            />
          </div>
          <div className=" pt-3">
            <div className="-mx-3 flex flex-wrap">
              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-5 relative">
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
                    className=" w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium  outline-none focus:border-fuchsia-400  focus:shadow-md"
                  />
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
              </div>
              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-5 relative">
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
                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium  outline-none focus:border-fuchsia-400  focus:shadow-md"
                    onFocus={() => setMatchFocus(true)}
                    onBlur={() => setMatchFocus(false)}
                  />
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
                  <p>
                    <FaInfoCircle />
                    Must match the password entry field.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="-mx-3 flex flex-wrap">
            <div className="w-full px-3 sm:w-1/2">
              <div className="mb-5">
                <div className="inline-flex items-center">
                  <label
                    className="relative flex items-center p-3 rounded-full cursor-pointer"
                    htmlFor="admin-on"
                    data-ripple-dark="true"
                  >
                    <input
                      onChange={(e) => setAdmin(e.target.checked)}
                      id="admin-on"
                      checked={admin}
                      type="checkbox"
                      className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-fuchsia-500 checked:bg-fuchsia-500 checked:before:bg-fuchsia-500 hover:before:opacity-10"
                    />
                    <span className="absolute text-white text-sm transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                      <FaCheck />
                    </span>
                  </label>
                  <label
                    className="mt-px   block text-base font-medium  text-gray-700 cursor-pointer select-none"
                    htmlFor="admin-on"
                  >
                    Admin
                  </label>
                </div>
              </div>
            </div>
            <div className="w-full px-3 sm:w-1/2">
              <div className="mb-5">
                <div className="inline-flex items-center">
                  <label
                    className="relative flex items-center p-3 rounded-full cursor-pointer"
                    htmlFor="verified-on"
                    data-ripple-dark="true"
                  >
                    <input
                      onChange={(e) => setVerified(e.target.checked)}
                      id="verified-on"
                      checked={verified}
                      type="checkbox"
                      className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-fuchsia-500 checked:bg-fuchsia-500 checked:before:bg-fuchsia-500 hover:before:opacity-10"
                    />
                    <span className="absolute text-white text-sm transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                      <FaCheck />
                    </span>
                  </label>
                  <label
                    className="mt-px   block text-base font-medium  text-gray-700 cursor-pointer select-none"
                    htmlFor="verified-on"
                  >
                    Is verified
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-5 pt-3">
            <label className="mb-5 block text-base font-semibold text-[#07074D] sm:text-xl">
              Address Details
            </label>
            <div className="-mx-3 flex flex-wrap">
              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-5">
                  <input
                    onChange={(e) => setCountry(e.target.value)}
                    type="text"
                    name="country"
                    value={country}
                    id="country"
                    placeholder="Enter country"
                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  />
                </div>
              </div>
              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-5">
                  <input
                    onChange={(e) => setCity(e.target.value)}
                    type="text"
                    name="city"
                    id="city"
                    value={city}
                    placeholder="Enter city"
                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  />
                </div>
              </div>
              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-5">
                  <input
                    onChange={(e) => setStreet(e.target.value)}
                    type="text"
                    name="street"
                    id="street"
                    value={street}
                    placeholder="Enter street"
                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  />
                </div>
              </div>
              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-5">
                  <input
                    onChange={(e) => setZip(e.target.value)}
                    type="text"
                    name="zip-code"
                    id="zip-code"
                    value={zip}
                    placeholder="Zip Code"
                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  />
                </div>
              </div>
              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-5">
                  <input
                    onChange={(e) => setApartment(e.target.value)}
                    type="text"
                    name="apartment"
                    id="apartment"
                    value={apartment}
                    placeholder="Enter building number"
                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            {isLoading ? (
              <button className="hover:shadow-htmlForm w-full rounded-md hover:bg-fuchsia-400  bg-fuchsia-500 py-3 px-8 text-center text-base font-semibold text-white outline-none">
                <svg
                  aria-hidden="true"
                  role="status"
                  className="inline mr-3 w-4 h-4 text-white animate-spin"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="#E5E7EB"
                  ></path>
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentColor"
                  ></path>
                </svg>
                Loading...
              </button>
            ) : (
              <button className="hover:shadow-htmlForm w-full rounded-md hover:bg-fuchsia-400  bg-fuchsia-500 py-3 px-8 text-center text-base font-semibold text-white outline-none">
                Update user
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
