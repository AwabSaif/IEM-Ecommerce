import { useEffect, useRef, useState } from "react";
import useAuth from "../../hooks/useAuth"; // Importing custom hook for authentication
import axios from "../../api/axios"; // Importing Axios for HTTP requests
import { Link, useNavigate, useParams } from "react-router-dom"; // Importing necessary hooks and components

import { AiOutlineMail } from "react-icons/ai"; // Importing icons
import { IoCloseCircleOutline } from "react-icons/io5";
import { HiOutlinePhone } from "react-icons/hi2";

export const OrderDetails = () => {
  // Authentication
  const { auth } = useAuth();
  const token = auth.token;
  const user = auth.id;
  
  // Getting order ID from URL params
  const { id } = useParams();

  // Ref to component
  const componentRef = useRef();

  // State variables for orders and order items
  const [orders, SetOrders] = useState([]);
  const [orderItems, setOrderItems] = useState([]);

  // Navigation
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };

  // Fetching orders data from API
  useEffect(() => {
    const getOrders = async () => {
      try {
        const response = await axios.get(`/api/orders/get/userorders/${user}`, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
          withCredentials: true,
        });
        // Set orders data to state
        SetOrders(response.data);
      } catch (error) {
        console.error("Error fetching Orders:", error);
      }
    };

    getOrders();
  }, [token]);

  // Find selected order by ID
  const selectedOrder = orders.find((order) => order.id === id);

  return (
    <article className="antialiased font-sans bg-white">
      {selectedOrder && selectedOrder.user && (
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
          {/* Order details */}
          <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"></div>
          <div className="container mx-auto px-4 sm:px-8">
            <div className="py-8">
              <div>
                <h2 className="text-2xl font-semibold leading-tight">
                  Order #{selectedOrder.orderNumber}
                </h2>
              </div>
              <div>
                <div>
                  <h2 className="text-2xl px-6 pt-6 font-semibold leading-tight hidden print:block">
                    Order #{selectedOrder.orderNumber}
                  </h2>
                </div>
                {/* Customer information */}
                <div className="w-full mt-6   flex justify-between items-start   px-4 py-6 md:p-6 xl:p-8 flex-col">
                  <h3 className="text-xl font-semibold leading-5 text-gray-800 ">
                    Customer
                  </h3>
                  <div className="flex flex-col md:flex-row lg:justify-start items-stretch h-full w-full space-x-6">
                    <div className="flex flex-col justify-start items-center flex-shrink-0">
                      <div className="flex justify-start w-full items-start space-x-4 pt-8 pb-3 border-b border-gray-200">
                        {/* Customer name */}
                        <p className="text-base font-semibold leading-4 text-left text-gray-800">
                          {selectedOrder.user.name}
                        </p>
                      </div>
                      {/* Customer email and phone */}
                      <div className="flex justify-center text-gray-800  md:justify-start items-center space-x-4 py-4 border-b border-gray-200 w-full">
                        <span className="text-lg font-sans">
                          <AiOutlineMail />
                        </span>
                        <p className="cursor-pointer text-sm leading-5 ">
                          {selectedOrder.user.email}
                        </p>
                        <span className="text-lg font-sans">
                          <HiOutlinePhone />
                        </span>
                        <p className="cursor-pointer text-sm leading-5 ">
                          {selectedOrder.phone}
                        </p>
                      </div>
                      {/* Order status */}
                      <div className="flex justify-start w-full items-start  pt-8 pb-3">
                        <span className="text-lg -mt-1.5 text-left font-sans">
                          Status:
                        </span>
                        <p
                          id="statusText"
                          className="ml-2 text-sm leading-5  print:block"
                        >
                          {selectedOrder.status}
                        </p>
                      </div>
                      {/* Payment method */}
                      <div className="flex justify-start w-full items-start  pt-8 pb-3">
                        <span className="text-lg -mt-1.5 text-left font-sans">
                          Payment method:
                        </span>
                        <p className="ml-2 text-smleading-5 -mt-1 print:block">
                          {selectedOrder.payment}
                        </p>
                      </div>
                    </div>
                    {/* Shipping addresses */}
                    <div className="flex justify-between  items-stretch w-full flex-col">
                      <div className="flex flex-col justify-between space-x-6  space-y-0 lg:flex-row items-center">
                        <div className="flex justify-start items-start flex-col space-y-4">
                          <p className="text-base  font-semibold leading-4 text-left text-gray-800">
                            Shipping Address 1
                          </p>
                          <p className="w-48  text-left text-sm leading-5 text-gray-600">
                            {selectedOrder.shippingAddress1}
                          </p>
                        </div>
                        <div className="flex  justify-start items-start flex-col space-y-4">
                          <p className="text-base mt-2 font-semibold leading-4 text-left text-gray-800">
                            Shipping Address 2
                          </p>
                          <p className="w-48  text-left text-sm leading-5 text-gray-600">
                            {selectedOrder.shippingAddress2}
                          </p>
                        </div>
                        <div className="flex justify-start items-start flex-col space-y-4">
                          <p className="text-base mt-2  font-semibold leading-4 text-left text-gray-800">
                            Address
                          </p>
                          <p className="w-48 text-left text-sm leading-5 text-gray-600 flex flex-col">
                            <p>Country: {selectedOrder.country}</p>
                            <p>City: {selectedOrder.city}</p>
                            <p>Zip: {selectedOrder.zip}</p>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Order items */}
                <div>
                  <div className="-mx-4  sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                    <div className="inline-block min-w-full  shadow rounded-lg overflow-hidden">
                      <table className="min-w-full  leading-normal">
                        <thead>
                          <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Product image
                            </th>
                            <th className="px-5 py-3 border-b-2 in   border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Product name
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Cost
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Qty
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Mapping through order items */}
                          {selectedOrder.orderItems.map((order) => (
                            <tr key={order.product.id}>
                              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                {/* Product image */}
                                <Link to={`/product/${order.product.id}`}>
                                  <div className="items-center">
                                    <div className="ml-3">
                                      <p className="text-gray-900 whitespace-no-wrap">
                                        <img
                                          className="w-16"
                                          src={order.product.image}
                                          alt={order.product.image}
                                        />
                                      </p>
                                    </div>
                                  </div>
                                </Link>
                              </td>
                              {/* Product name */}
                              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <Link to={`/product/${order.product.id}`}>
                                  <p className="text-gray-900 whitespace-no-wrap ">
                                    {order.product.name}
                                  </p>
                                </Link>
                              </td>
                              {/* Product price */}
                              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <p className="text-gray-900 whitespace-no-wrap">
                                  {order.product.price}
                                </p>
                              </td>
                              {/* Quantity */}
                              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <p className="text-gray-900 whitespace-no-wrap">
                                  {order.quantity}
                                </p>
                              </td>
                              {/* Total price */}
                              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <p className="text-gray-900 whitespace-no-wrap">
                                  {order.quantity * order.product.price}$
                                </p>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {/* Total price */}
                      <div className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between ">
                        <span className=" flex  flex-row items-center justify-between text-gray-900 whitespace-no-wrap ">
                          TOTAL: &nbsp;${selectedOrder.totalPrice}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};
