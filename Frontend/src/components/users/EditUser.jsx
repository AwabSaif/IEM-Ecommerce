import { useEffect, useRef, useState } from "react";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { IoCloseCircleOutline } from "react-icons/io5";
import { ChanePassword } from "./ChanePassword";
const GETUSER_URL = "/api/users/";
const EDITUSER_URL = "/api/users/updateuser";

export const EditUser = () => {
  //auth
  const { auth } = useAuth();
  const token = auth.token;
  //id from link
  const { id } = useParams();

  //set error
  const errRef = useRef();

  // navigate link or page
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  //loading page
  const isLoading = useRef(false);

  //form
  const [user, setUser] = useState({});
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [apartment, setApartment] = useState("");

  //message
  const [errMsg, setErrMsg] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  //show modal password
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    const fetchUser = async () => {
      isLoading.current = true;
      try {
        const response = await axios.get(GETUSER_URL + id, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
        });
        setUser(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        isLoading.current = false;
      }
    };

    if (!user.id) {
      fetchUser();
    }
  }, [user.id]);

  useEffect(() => {
    if (user.id) {
      setUsername(user.name);
      setEmail(user.email);
      setPhone(user.phone);
      setCountry(user.country);
      setCity(user.city);
      setStreet(user.street);
      setZip(user.zip);
      setApartment(user.apartment);
    }
  }, [user]);

  useEffect(() => {
    setErrMsg("");
  }, [username, email, phone]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setErrMsg(null);
      const formFile = {
        _id: id,
        name: username,
        phone,
        street,
        country,
        city,
        zip,
        apartment,
      };

      const response = await axios.patch(EDITUSER_URL, formFile, {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
        withCredentials: true,
      });
      // console.log(response);
      setSuccessMessage("User updated successfully");
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
    <div className="flex items-center justify-center p-12">
      <div className="mx-auto w-full max-w-[550px] bg-white">
        <h3 className="mb-4  -ml-10 text-2xl font-medium ">Edit user</h3>
        {!showModal ? (
          <div className="relative ">
            <button
              className={`absolute cursor-pointer  white  -right-1 rounded-full  `}
              onClick={() => navigate(from, { replace: true })}
            >
              <span className="text-fuchsia-500 text-2xl">
                <IoCloseCircleOutline />
              </span>
            </button>
          </div>
        ) : null}
        {/* show passsword */}
        <div
          className={`mb-8 ${
            showModal
              ? "border-b border-fuchsia-300 shadow hover:shadow-lg outline-none focus:outline-none p-5 ease-linear "
              : null
          } `}
        >
          {!showModal ? (
            <button
              className="bg-fuchsia-500  text-white active:bg-fuchsia-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
              onClick={() => setShowModal(true)}
            >
              Change Password
            </button>
          ) : null}
          {showModal ? (
            <>
              <div className="relative ">
                <button
                  className={`absolute cursor-pointer  white  -lift-1 rounded-full  `}
                  onClick={() => setShowModal(false)}
                >
                  <span className="text-fuchsia-500 text-2xl">
                    <IoCloseCircleOutline />
                  </span>
                </button>
              </div>

              <ChanePassword />
            </>
          ) : null}
        </div>
        <form onSubmit={handleSubmit}>
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
              className="w-full rounded-md  border  border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium  outline-none focus:border-fuchsia-400  focus:shadow-md"
            />
          </div>
          <div className="mb-5">
            <label htmlFor="email" className="mb-3 block text-base font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              disabled
              value={email}
              placeholder="Enter your email"
              className="w-full rounded-md border disabled:bg-gray-200 border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium  outline-none focus:border-fuchsia-400  focus:shadow-md"
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
          {/* Address Details */}
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
            <button className="hover:shadow-htmlForm w-full rounded-md hover:bg-fuchsia-400  bg-fuchsia-500 py-3 px-8 text-center text-base font-semibold text-white outline-none">
              Update user
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
