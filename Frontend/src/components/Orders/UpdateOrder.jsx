import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import ReactToPrint from "react-to-print";
import Barcode from "react-barcode";
import { AiOutlineMail } from "react-icons/ai";
import { IoCloseCircleOutline } from "react-icons/io5";
import { OrderItems } from "./OrderItems";
import { IoPrintOutline } from "react-icons/io5";

export const UpdateOrder = () => {
  //auth
  const { auth } = useAuth();
  const token = auth.token;
  //id from link
  const { id } = useParams();

  const componentRef = useRef();
  //data
  const [orders, SetOrders] = useState([]);
  const [status, SetStatus] = useState("");
  const [orderItems, setOrderItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
 
  //navigate
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";
  //error
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  //message success
  const [successMessage, setSuccessMessage] = useState("");
  //get data
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
        // console.log(response.data);
        SetOrders(response.data);
        setOrderItems(response.data.orderItems);
        setTotalPrice(response.data.totalPrice);
        SetStatus(response.data.status);
      } catch (error) {
        console.error("Error fetching Orders:", error);
      }
    };

    getOrders();
  }, [token]);
  //submit form
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
    //   console.log(response);
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
              onClick={() => navigate(from, { replace: true })}
            >
              <span className="text-fuchsia-500 text-2xl">
                <IoCloseCircleOutline />
              </span>
            </button>
          </div>
          <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"></div>
          <div className="container mx-auto px-4 sm:px-8">
            <div className="py-8">
              <div>
                <h2 className="text-2xl font-semibold leading-tight">
                  Order #{orders.orderNumber}
                </h2>
              </div>
              <div className="mt-5 flex items-center gap-4">
                <button
                  onClick={handleSubmit}
                  className="hover:shadow-htmlForm   rounded-md bg-fuchsia-500 py-2.5  px-11 text-center text-base font-semibold text-white outline-none"
                >
                  Update order status
                </button>

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

                {successMessage && (
                  <div className=" bg-fuchsia-100 border w-80 border-fuchsia-400 text-fuchsia-700 px-2 py-2   rounded relative">
                    {successMessage}
                  </div>
                )}
              </div>
              <div ref={componentRef}>
                <div>
                  <h2 className="text-2xl px-6 pt-6 font-semibold leading-tight hidden print:block">
                    Order #{orders.orderNumber}
                  </h2>
                </div>
                <div className="w-full mt-6 shadow rounded-lg   flex justify-between items-start  px-4 py-6 md:p-6 xl:p-8 flex-col">
                  <h3 className="text-xl font-semibold leading-5 text-gray-800">
                    Customer
                  </h3>
                  <div className="flex flex-row justify-start items-stretch h-full w-full space-x-6">
                    <div className="flex flex-col justify-start items-center flex-shrink-0">
                      <div className="flex justify-start w-full items-start space-x-4 pt-8 pb-3 border-b border-gray-200">
                        <p className="text-base font-semibold leading-4 text-left text-gray-800">
                          {orders.user.name}
                        </p>
                      </div>
                      <div className="flex justify-center text-gray-800  md:justify-start items-center space-x-4 py-4 border-b border-gray-200 w-full">
                        <span className="text-lg font-sans">
                          <AiOutlineMail />
                        </span>
                        <p className="cursor-pointer text-sm leading-5 ">
                          {orders.user.email}
                        </p>
                      </div>
                      <div className="flex justify-start w-full items-start  pt-8 pb-3">
                        <span className="text-lg -mt-1.5 text-left font-sans">
                          Status:
                        </span>
                        <select
                          id="status"
                          name="status"
                          onChange={(e) => SetStatus(e.target.value)}
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
                    </div>
                    <div className="flex justify-between items-stretch w-full flex-col">
                      <div className="flex justify-start  space-x-6  space-y-0 flex-row items-center">
                        <div className="flex justify-start items-start flex-col space-y-4">
                          <p className="text-base  font-semibold leading-4 text-left text-gray-800">
                            Shipping Address 1
                          </p>
                          <p className="w-48  text-left text-sm leading-5 text-gray-600">
                            {orders.shippingAddress1}
                          </p>
                        </div>
                        <div className="flex justify-start items-start flex-col space-y-4">
                          <p className="text-base  font-semibold leading-4 text-left text-gray-800">
                            Shipping Address 2
                          </p>
                          <p className="w-48  text-left text-sm leading-5 text-gray-600">
                            {orders.shippingAddress2}
                          </p>
                        </div>
                        <div className="flex justify-start items-start flex-col space-y-4">
                          <p className="text-base  font-semibold leading-4 text-left text-gray-800">
                            Billing Address
                          </p>
                          <p className="w-48 text-left text-sm leading-5 text-gray-600">
                            {orders.user.city || "N/A"}-
                            {orders.user.street || "N/A"}-
                            {orders.user.zip || "N/A"}-
                            {orders.user.apartment || "N/A"}
                          </p>
                        </div>
                      </div>
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
