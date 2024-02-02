import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { CartPageItems } from "../../components/Cart/CartPageItems";
import useCart from "../../hooks/useCart";
import { BsArrowLeftCircleFill } from "react-icons/bs";
import useAuth from "../../hooks/useAuth";
const GETPRODUCT_URL = "/api/products";

export const CheckOut = () => {
  //auth
  const { auth } = useAuth();
  const token = auth.token;
  const user = auth.id;
  
  //set error
  const errRef = useRef();

  //navigate
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };
  //message
  const [errMsg, setErrMsg] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  //loading page
  const [isLoading, setIsLoading] = useState(false);

  //get data
  const [products, setProducts] = useState([]);
  const { cartItems, CartQuantity, getItemsQuantity ,handleRemoveCartAfterOrder } = useCart();
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(GETPRODUCT_URL);
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
  //from

  const [orderItems, setOrderItems] = useState([]);
  const [shippingAddress1, SetShippingAddress1] = useState("");
  const [shippingAddress2, setShippingAddress2] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");

  useEffect(() => {
    const updatedOrderItems = cartItems.map((cartItem) => {
      return {
        quantity: cartItem.quantity,
        product: cartItem.id,
      };
    });
    setOrderItems(updatedOrderItems);
  }, [cartItems]);
console.log(user);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
        setErrMsg("Please log in before placing an order.");
        navigate('/login')
        return;
      }
    try {
      setIsLoading(true);
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
      };
      console.log(formFile);
      const response = await axios.post("/api/orders" , formFile, {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
        withCredentials: true,
      });
        
        console.log(response.data);
      setSuccessMessage("order created successfully");
      setIsLoading(false);
      handleRemoveCartAfterOrder();
    } catch (err) {
      if (!err?.response) {
        setErrMsg("Server not responding");
        setIsLoading(false);
      } else {
        setErrMsg(err.response.data.message);
        setIsLoading(false);
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
                    placeholder="Zip Code"
                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mb-2 flex justify-between">
            <p className="text-gray-700">Number of Items</p>
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
          <button className="mt-6 w-full rounded-md bg-fuchsia-500 py-1.5 font-medium text-fuchsia-50 hover:bg-fuchsia-600/80">
            PLACE ORDER
          </button>
        </form>
      </div>
    </div>
  );
};
