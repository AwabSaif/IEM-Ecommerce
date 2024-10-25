import React, { useEffect, useState } from "react";
import { BsArrowLeftCircleFill } from "react-icons/bs";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import axios from "../../api/axios";
import { OrderDetails } from "../../components/Orders/OrderDetails";

export const MyOrders = () => {
  // Custom hook for authentication
  const { auth } = useAuth();
  const token = auth.token;

  // Navigation
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };

  // Retrieve user ID from URL parameters
  const { id } = useParams();

  // State to store user orders
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Function to fetch user orders from the server
    const getOrders = async () => {
      try {
        const response = await axios.get(`/api/orders/get/userorders/${id}`, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
          withCredentials: true,
        });
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching Orders:", error);
      }
    };

    getOrders(); // Fetch user orders on component mount
  }, [token]); // Re-fetch user orders when token changes

  return (
    <>
      <div className="h-screen relative overflow-y-scroll pt-20">
        <div className="relative">
          {/* Button to navigate back */}
          <button
            className={`absolute cursor-pointer -mt-6 white mr-32 -right-1 rounded-full`}
            onClick={handleGoBack}
          >
            <span className="text-fuchsia-400 text-2xl">
              <BsArrowLeftCircleFill className="rotate-180" />
            </span>
          </button>
        </div>
        {/* Title */}
        <h1 className="mb-10 text-center text-2xl font-bold">My Orders</h1>
        <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
          <div className="rounded-lg md:w-2/3">
            {/* Display user orders */}
            {orders.length > 0 ? (
              orders.map((order) => {
                return (
                  <div className="justify-between mb-6 rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start" key={order.id}>
                    <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                      {/* Order details */}
                      <div className="mt-5 sm:mt-0">
                        <h2 className="text-lg font-bold text-gray-900">
                          Order Number #{order?.orderNumber}
                        </h2>
                        <p className="mt-1 text-xs text-gray-700">
                          Date:{" "}
                          {order?.dateOrdered
                            ? new Date(order?.dateOrdered).toLocaleDateString(
                                "en-GB"
                              )
                            : ""}
                        </p>
                        <p className="mt-1 text-xs text-gray-700">
                          Order Status: {order?.status}
                        </p>
                      </div>
                      {/* Order total and payment method */}
                      <div className="mt-4 flex flex-col justify-between sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
                        <div className="flex items-center space-x-4">
                          <p className="text-gray-700 font-medium">
                            Total: ${order?.totalPrice}
                          </p>
                          <p className="text-gray-700 font-medium">
                            Payment method: {order?.payment}
                          </p>
                        </div>
                        {/* Link to view order details */}
                        <div className="flex justify-end items-center">
                          <Link
                            to={`/orderdetails/${order.id}`}
                            className="font-medium text-fuchsia-600 hover:text-fuchsia-500"
                          >
                            More details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              // Display message when no orders are available
              <div
                className="flex items-center text-center justify-center rounded-md bg-fuchsia-500 text-white text-sm font-bold px-4 py-3"
                role="alert"
              >
                <p>There are no Orders to display</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
