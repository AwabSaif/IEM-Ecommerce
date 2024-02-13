import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import ReactToPrint from "react-to-print";
import Barcode from "react-barcode";
import { AiOutlineMail } from "react-icons/ai";
import { IoCloseCircleOutline } from "react-icons/io5";
import { OrderItems } from "./OrderItems";
import { IoPrintOutline } from "react-icons/io5";
import { HiOutlinePhone } from "react-icons/hi2";

export const UpdateOrder = () => {
  // Authentication
  const { auth } = useAuth();
  const token = auth.token;

  // Get order ID from the URL
  const { id } = useParams();

  // Ref for printing
  const componentRef = useRef();

  // State variables
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("");
  const [orderItems, setOrderItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // Navigation
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };

  // Error handling
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");

  // Success message
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch order data
  useEffect(() => {
    const getOrders = async () => {
      try {
        const response = await axios.get(`/api/orders/${id}`, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
          withCredentials: true,
        });
        setOrders(response.data);
        setOrderItems(response.data.orderItems);
        setTotalPrice(response.data.totalPrice);
        setStatus(response.data.status);
      } catch (error) {
        console.error("Error fetching Orders:", error);
      }
    };

    getOrders();
  }, [token]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setErrMsg(null);
      const formFile = {
        status,
      };

      const response = await axios.put(`/api/orders/${id}`, formFile, {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
        withCredentials: true,
      });
      setSuccessMessage(
        `Order Status Updated to ${response.data.status} successfully`
      );
    } catch (err) {
      if (!err?.response) {
        setErrMsg("Server not responding");
        console.log(err);
      } else {
        setErrMsg(err.response.data.message);
      }
      errRef.current.focus();
    }
  };

  return (
    <article className="antialiased font-sans bg-white">
      {orders && orders.user && (
        <div className="isolate bg-white px-6 py-4 sm:py-6 lg:px-8">
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
          {/* Printing background */}
          <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"></div>
          <div className="container mx-auto px-4 sm:px-8">
            <div className="py-8">
              <div>
                <h2 className="text-2xl font-semibold leading-tight">
                  Order #{orders.orderNumber}
                </h2>
              </div>
              <div className="mt-5 flex items-center gap-4">
                {/* Update order status button */}
                <button
                  onClick={handleSubmit}
                  className="hover:shadow-htmlForm   rounded-md bg-fuchsia-500 py-2.5  px-11 text-center text-base font-semibold text-white outline-none"
                >
                  Update order status
                </button>

                {/* Print order button */}
                <ReactToPrint
                  trigger={() => {
                    return (
                      <button className="hover:shadow-htmlForm flex rounded-md bg-fuchsia-500 p-2.5 text-center text-base font-semibold text-white outline-none">
                        Print order
                        <span className="ml-2 text-2xl">
                          <IoPrintOutline />
                        </span>
                      </button>
                    );
                  }}
                  content={() => componentRef.current}
                  documentTitle={"Order #" + orders.orderNumber}
                />

                {/* Error message */}
                <div
                  ref={errRef}
                  className={
                    errMsg
                      ? "bg-fuchsia-100 border w-80 border-fuchsia-400 text-fuchsia-700 px-2 py-2 mb-2  rounded relative"
                      : "hidden"
                  }
                  aria-live="assertive"
                  role="alert"
                >
                  <span className="block sm:inline">{errMsg}</span>
                </div>

                {/* Success message */}
                {successMessage && (
                  <div className=" bg-fuchsia-100 border w-80 border-fuchsia-400 text-fuchsia-700 px-2 py-2   rounded relative">
                    {successMessage}
                  </div>
                )}
              </div>
              {/* Printable component */}
              <div ref={componentRef}>
                <div>
                  <h2 className="text-2xl px-6 pt-6 font-semibold leading-tight hidden print:block">
                    Order #{orders.orderNumber}
                  </h2>
                </div>
                {/* Order details */}
                <div className="w-full mt-6 shadow rounded-lg   flex justify-between items-start  px-4 py-6 md:p-6 xl:p-8 flex-col">
                  <h3 className="text-xl font-semibold leading-5 text-gray-800">
                    Customer
                  </h3>
                  {/* Customer information */}
                  <div className="flex flex-row justify-start items-stretch h-full w-full space-x-6">
                    <div className="flex flex-col justify-start items-center flex-shrink-0">
                      {/* Customer name */}
                      <div className="flex justify-start w-full items-start space-x-4 pt-8 pb-3 border-b border-gray-200">
                        <p className="text-base font-semibold leading-4 text-left text-gray-800">
                          {orders.user.name}
                        </p>
                      </div>
                      {/* Customer email and phone */}
                      <div className="flex justify-center text-gray-800  md:justify-start items-center space-x-4 py-4 border-b border-gray-200 w-full">
                        <span className="text-lg font-sans">
                          <AiOutlineMail />
                        </span>
                        <p className="cursor-pointer text-sm leading-5 ">
                          {orders.user.email}
                        </p>
                        <span className="text-lg font-sans">
                          <HiOutlinePhone />
                        </span>
                        <p className="cursor-pointer text-sm leading-5 ">
                          {orders.phone}
                        </p>
                      </div>
                      {/* Order status */}
                      <div className="flex justify-start w-full items-start  pt-8 pb-3">
                        <span className="text-lg -mt-1.5 text-left font-sans">
                          Status:
                        </span>
                        <select
                          id="status"
                          name="status"
                          onChange={(e) => setStatus(e.target.value)}
                          value={status}
                          className="print:hidden w-full rounded-md border border-[#e0e0e0]  bg-white px-3.5 -mt-2 ml-2 py-1.5 text-base font-medium  outline-none focus:border-fuchsia-400  focus:shadow-md"
                        >
                          <option value="Pending payment">
                            Pending Payment
                          </option>
                          <option value="On hold">On hold</option>
                          <option value="Processing">Processing</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                          <option value="Refunded">Refunded</option>
                          <option value="Failed">Failed</option>
                        </select>
                        <p
                          id="statusText"
                          className="ml-2 text-sm leading-5 hidden print:block"
                        >
                          {status}
                        </p>
                      </div>
                      {/* Payment method */}
                      <div className="flex justify-start w-full items-start flex-col space-y-4">
                        <span className="text-lg -mt-1.5 text-left font-sans">
                          Payment method:
                        </span>
                        <p className="ml-2 text-smleading-10 -mt-1 print:block">
                          {orders.payment}
                        </p>
                      </div>
                    </div>
                    {/* Shipping address */}
                    <div className="flex justify-between items-stretch w-full flex-col">
                      <div className="flex justify-start  space-x-6  space-y-0 flex-row items-center">
                        {/* Shipping address 1 */}
                        <div className="flex justify-start items-start flex-col space-y-4">
                          <p className="text-base  font-semibold leading-4 text-left text-gray-800">
                            Shipping Address 1
                          </p>
                          <p className="w-48  text-left text-sm leading-5 text-gray-600">
                            {orders.shippingAddress1}
                          </p>
                        </div>
                        {/* Shipping address 2 */}
                        <div className="flex justify-start items-start flex-col space-y-4">
                          <p className="text-base  font-semibold leading-4 text-left text-gray-800">
                            Shipping Address 2
                          </p>
                          <p className="w-48  text-left text-sm leading-5 text-gray-600">
                            {orders.shippingAddress2}
                          </p>
                        </div>
                        {/* Address details */}
                        <div className="flex justify-start items-start flex-col space-y-4">
                          <p className="text-base  font-semibold leading-4 text-left text-gray-800">
                            Address
                          </p>
                          <p className="w-48 text-left text-sm leading-5 text-gray-600 flex flex-col">
                            <p>Country: {orders.country}</p>
                            <p>City: {orders.city}</p>
                            <p>Zip: {orders.zip}</p>
                          </p>
                        </div>
                      </div>
                      {/* Barcode */}
                      <div className=" hidden print:flex items-center  flex-col">
                        <Barcode
                          width={1.5}
                          height={29}
                          value={orders.orderNumber}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Order items */}
                <div>
                  <OrderItems orderItems={orderItems} totalPrice={totalPrice} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};
