import { useEffect, useRef, useState } from "react";
import axios from "../../api/axios"; // Importing Axios for API calls
import useAuth from "../../hooks/useAuth"; // Importing custom hook for authentication
import { useLocation, useNavigate, useParams } from "react-router-dom"; // Importing hooks for routing
import { IoCloseCircleOutline } from "react-icons/io5"; // Importing close icon from React Icons
import { ChanePassword } from "./ChanePassword"; // Importing component for changing password

const GETUSER_URL = "/api/users/"; // Endpoint for getting user details
const EDITUSER_URL = "/api/users/updateuser"; // Endpoint for updating user details

export const EditUser = () => {
  // Authentication
  const { auth } = useAuth();
  const token = auth.token;
  const curuser = auth.id;

  // User ID from URL params
  const { id } = useParams();

  // Ref for error handling
  const errRef = useRef();

  // Navigation
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Form fields
  const [user, setUser] = useState({});
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [apartment, setApartment] = useState("");

  // Error and success messages
  const [errMsg, setErrMsg] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Modal state for password change
  const [showModal, setShowModal] = useState(false);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(GETUSER_URL + id, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
          withCredentials: true,
        });
        setUser(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUser();
  }, []);

  // Update form fields when user data is fetched
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

  // Clear error message when form fields change
  useEffect(() => {
    setErrMsg("");
  }, [username, email, phone]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setErrMsg(null);
      setIsLoading(true);
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
        {curuser ? (
          <>
            <h3 className="mb-4  -ml-10 text-2xl font-medium ">Edit user</h3>
            {!showModal ? (
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
                <label
                  htmlFor="email"
                  className="mb-3 block text-base font-medium"
                >
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
                <label
                  htmlFor="phone"
                  className="mb-3 block text-base font-medium"
                >
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
          </>
        ) : (
          <div className="flex gap-3 flex-col items-center justify-center ">
            <div
              className="w-full flex items-center text-center justify-center rounded-md bg-fuchsia-500 text-white text-sm font-bold px-4 py-3"
              role="alert"
            >
              <p>please login before displaying page</p>
            </div>

            <button className=" bg-fuchsia-500 hover:bg-fuchsia-700 text-white font-bold py-2 px-4 disabled:bg-fuchsia-300  rounded-full">
              sign in
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
