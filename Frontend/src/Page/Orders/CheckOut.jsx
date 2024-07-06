import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { CartPageItems } from "../../components/Cart/CartPageItems";
import useCart from "../../hooks/useCart";
import { BsArrowLeftCircleFill } from "react-icons/bs";
import useAuth from "../../hooks/useAuth";

// URL to fetch products
const GETPRODUCT_URL = "/api/products";

export const CheckOut = () => {
  // Authentication
  const { auth } = useAuth();
  const token = auth.token;
  const user = auth.id;

  // Ref for error message
  const errRef = useRef();

  // Navigation
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };

  // State for error and success messages
  const [errMsg, setErrMsg] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Loading state
  const [isloading, setIsloading] = useState(false);

  // State for product data
  const [products, setProducts] = useState([]);

  // Cart related hooks
  const {
    cartItems,
    CartQuantity,
    getItemsQuantity,
    handleRemoveCartAfterOrder,
  } = useCart();

  // Fetching products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(GETPRODUCT_URL  );
        setProducts(response.data);
      } catch (err) {
        if (err?.response) {
          console.log(err.response.data);
        } else {
          console.log(`Error: ${err.message}`);
        }
      }
    };
    fetchProducts();
  }, []);

  // Form state for order
  const [orderItems, setOrderItems] = useState([]);
  const [shippingAddress1, SetShippingAddress1] = useState("");
  const [shippingAddress2, setShippingAddress2] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [payment, Setpayment] = useState("");

  // Update order items when cart items change
  useEffect(() => {
    const updatedOrderItems = cartItems.map((cartItem) => {
      return {
        quantity: cartItem.quantity,
        product: cartItem.id,
      };
    });
    setOrderItems(updatedOrderItems);
  }, [cartItems]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsloading(true);
    if (!user) {
      setErrMsg("Please log in before placing an order.");
      navigate("/login");
      return;
    }
    if (!payment) {
      setErrMsg("Please choose a payment method before placing an order.");
      return;
    }

    try {
      setErrMsg(null);
      const formFile = {
        orderItems,
        shippingAddress1,
        shippingAddress2,
        phone,
        country,
        city,
        zip,
        user,
        payment,
      };
      const response = await axios.post("/api/orders", formFile, {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
         
      });
      setSuccessMessage("order created successfully");
      setIsloading(false);
      handleRemoveCartAfterOrder();
      setOrderItems([]);
      Setpayment("");
      setZip("");
      setCity("");
      setCountry("");
      setPhone("");
      setShippingAddress2("");
      SetShippingAddress1("");
    } catch (err) {
      setIsloading(false);
      if (!err?.response) {
        setErrMsg("Server not responding");
      } else {
        setErrMsg(err.response.data.message);
      }
      errRef.current.focus();
    }
  };
  return (
    <div className="h-screen relative overflow-y-scroll  pt-20">
      <div
        ref={errRef}
        className={
          errMsg
            ? "bg-fuchsia-100 border w-2/6 flex justify-center items-center border-fuchsia-400 text-fuchsia-700 px-2 py-2 mb-2  rounded relative"
            : "hidden"
        }
        aria-live="assertive"
        role="alert"
      >
        <span className="block sm:inline">{errMsg}</span>
      </div>
      {successMessage && (
        <div className=" bg-fuchsia-100 border w-2/6 flex justify-center items-center border-fuchsia-400 text-fuchsia-700 px-2 py-2 mb-2  rounded relative">
          {successMessage}
        </div>
      )}
      <div className="relative ">
        <button
          className={`absolute cursor-pointer -mt-6 white mr-32 -right-1 rounded-full  `}
          onClick={handleGoBack}
        >
          <span className="text-fuchsia-400 text-2xl">
            <BsArrowLeftCircleFill className="rotate-180" />
          </span>
        </button>
      </div>
      <h1 className="mb-10 text-center text-2xl font-bold">Checkout</h1>
      <div className="mx-auto max-w-5xl  justify-center md:items-center   px-6 lg:flex md:space-x-6 xl:px-0">
        <div className="rounded-lg md:w-2/3">
          <h3 className="mb-5 block text-lg font-bold sm:text-xl ">
            YOUR ORDER
          </h3>
          {cartItems.map((item) => {
            const quantity = getItemsQuantity(item.id);
            if (quantity > 0) {
              return <CartPageItems key={item.id} {...item} />;
            } else {
              return null;
            }
          })}
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6  lg:w-1/2 h-full rounded-lg border lg:sticky -bottom-1  bg-white p-6 shadow-md    md:mt-0 "
        >
          <div className="mb-5 pt-3">
            <p className="mb-5 block text-lg font-bold sm:text-xl">
              Address Details
            </p>

            <div>
              <label
                htmlFor="shippingAddress1"
                className="mb-3 block text-base font-medium"
              >
                Shipping Address 1
              </label>

              <input
                onChange={(e) => SetShippingAddress1(e.target.value)}
                type="text"
                name="shippingAddress1"
                id="shippingAddress1"
                required
                value={shippingAddress1}
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-2 px-6 text-base font-medium  outline-none focus:border-fuchsia-400  focus:shadow-md"
              />
            </div>
            <div>
              <label
                htmlFor="shippingAddress2"
                className="mb-3 block text-base font-medium"
              >
                Shipping Address 2
              </label>

              <input
                onChange={(e) => setShippingAddress2(e.target.value)}
                type="text"
                name="shippingAddress2"
                id="shippingAddress2"
                required
                value={shippingAddress2}
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-2 px-6 text-base font-medium  outline-none focus:border-fuchsia-400  focus:shadow-md"
              />
            </div>
            <div className="-mx-3 mt-5 flex flex-wrap">
              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-5">
                  <input
                    onChange={(e) => setPhone(e.target.value)}
                    type="text"
                    name="phone"
                    id="phone"
                    required
                    value={phone}
                    placeholder="Phone Number"
                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  />
                </div>
              </div>
              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-5">
                  <input
                    onChange={(e) => setCountry(e.target.value)}
                    type="text"
                    name="country"
                    id="country"
                    required
                    value={country}
                    placeholder="Country"
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
                    required
                    value={city}
                    placeholder="City"
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
                    required
                    value={zip}
                    placeholder="Zip Code"
                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-start w-full items-start  pt-8 pb-3">
            <label
              htmlFor="payment"
              className="mb-3 block text-base font-medium"
            >
              Payment method
            </label>
            <select
              id="payment"
              name="payment"
              value={payment}
              onChange={(e) => Setpayment(e.target.value)}
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-2 px-6 text-base font-medium  outline-none focus:border-fuchsia-400  focus:shadow-md"
            >
              <option>Choose</option>
              <option value="Cash on delivery">Cash on delivery</option>
              {/* <option value="Visa">Visa</option> */}
            </select>
          </div>
          <div className="mb-2 flex justify-between">
            <p className="text-gray-700">Items in cart</p>
            <p className="text-gray-700">{CartQuantity}</p>
          </div>

          <hr className="my-4" />
          <div className="flex justify-between">
            <p className="text-lg font-bold">Total</p>
            <div className="">
              <p className="mb-1 text-lg font-bold">
                $
                {cartItems.reduce((totol, cartItem) => {
                  const item = products.find((i) => i.id === cartItem.id);
                  return totol + (item?.price || 0) * cartItem.quantity;
                }, 0)}
              </p>
            </div>
          </div>
          {isloading ? (
            <button className="mt-6 w-full rounded-md bg-fuchsia-500 py-1.5 font-medium text-fuchsia-50 hover:bg-fuchsia-600/80">
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
            <button className="mt-6 w-full rounded-md bg-fuchsia-500 py-1.5 font-medium text-fuchsia-50 hover:bg-fuchsia-600/80">
              PLACE ORDER
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
