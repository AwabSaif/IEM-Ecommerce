import React, { useEffect, useState } from "react";
import useCart from "../../hooks/useCart";
import { CartPageItems } from "./CartPageItems";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { BsArrowLeftCircleFill } from "react-icons/bs";

// API endpoint for fetching products
const GETPRODUCT_URL = "/api/products";

export const CartPage = () => {
  // Navigate to previous page
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };

  // State variables
  const [products, setProducts] = useState([]);
  const { cartItems, CartQuantity, getItemsQuantity } = useCart();

  // Fetch products from server on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(GETPRODUCT_URL, { withCredentials: true });
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

  return (
    <div className="h-screen relative overflow-y-scroll pt-20">
      <div className="relative">
        {/* Button to navigate back */}
        <button
          className={`absolute cursor-pointer -mt-6 white mr-32 -right-1 rounded-full  `}
          onClick={handleGoBack}
        >
          <span className="text-fuchsia-400 text-2xl">
            <BsArrowLeftCircleFill className="rotate-180" />
          </span>
        </button>
      </div>

      {/* Heading */}
      <h1 className="mb-10 text-center text-2xl font-bold">Cart Items</h1>

      {/* Cart Items */}
      <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
        <div className="rounded-lg md:w-2/3">
          {cartItems.map((item) => {
            const quantity = getItemsQuantity(item.id);
            if (quantity > 0) {
              return <CartPageItems key={item.id} {...item} />;
            } else {
              return null;
            }
          })}
        </div>

        {/* Cart Summary */}
        <div className="mt-6 h-full rounded-lg border sticky top-0 bg-white p-6 shadow-md md:mt-0 md:w-1/3">
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
                {cartItems.reduce((total, cartItem) => {
                  const item = products.find((i) => i.id === cartItem.id);
                  return total + (item?.price || 0) * cartItem.quantity;
                }, 0)}
              </p>
            </div>
          </div>

          {/* Checkout Button */}
          <button onClick={() => navigate('/checkout')} className="mt-6 w-full rounded-md bg-fuchsia-500 py-1.5 font-medium text-fuchsia-50 hover:bg-fuchsia-600/80">
            Check out
          </button>
        </div>
      </div>
    </div>
  );
};
