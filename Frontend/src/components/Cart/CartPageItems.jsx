import React, { useEffect, useState } from "react";
import useCart from "../../hooks/useCart";
import axios from "../../api/axios";

const GETPRODUCT_URL = "/api/products";

export const CartPageItems = ({ id, quantity }) => {
  // Custom hook to handle cart functionality
  const { increaseCartQuantity, decreaseCartQuantity, removeItemFromCart } =
    useCart();

  // State to store products data
  const [products, setProducts] = useState([]);
  
  // Find the item with the specified ID
  const item = products.find((i) => i.id === id);

  // Fetch products data from the server
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(GETPRODUCT_URL   );

        // Update products state with the fetched data
        setProducts(response.data);
      } catch (err) {
        // Handle errors during fetching data
        if (err?.response) {
          console.log(err.response.data);
        } else {
          console.log(`Error: ${err.message}`);
        }
      }
    };
    // Invoke the fetchProducts function when the component mounts
    fetchProducts();
  }, []);

  // If the item is not found, return null
  if (!item) {
    return null;
  }

  return (
    <div className="justify-between mb-6 rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start">
      <img
        src={item.image}
        alt={item.image}
        className="w-fullh-full w-full object-cover object-center rounded-lg sm:w-40"
      />
      <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
        <div className="mt-5 sm:mt-0">
          {/* Display item name */}
          <h2 className="text-lg font-bold text-gray-900">{item.name}</h2>
          {/* Display item price */}
          <p className="mt-1 text-xs text-gray-700">${item.price}</p>
        </div>
        <div className="mt-4 flex justify-between sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
          <div className="flex items-center border-fuchsia-100">
            {/* Button to decrease item quantity */}
            <button
              onClick={() => decreaseCartQuantity(id)}
              className="cursor-pointer rounded-l bg-fuchsia-100 py-1 px-3.5 duration-100 hover:bg-fuchsia-500 hover:text-fuchsia-50"
            >
              -
            </button>

            {/* Display item quantity */}
            <span className="h-8 w-8 border flex  justify-center items-center bg-white text-xs outline-none">
              {quantity}
            </span>
            {/* Button to increase item quantity */}
            <button
              onClick={() => increaseCartQuantity(id, item.countInStock)}
              disabled={quantity >= item.countInStock}
              className="cursor-pointer rounded-r bg-fuchsia-100 py-1 px-3 duration-100 hover:bg-fuchsia-500 hover:text-fuchsia-50"
            >
              +
            </button>
          </div>
          <div className="flex items-center space-x-4">
            {/* Display total price */}
            <p className="text-gray-700 font-medium">
              ${item.price * quantity}
            </p>
            {/* Button to remove item from cart */}
            <button
              type="button"
              onClick={() => removeItemFromCart(id)}
              className="font-medium text-fuchsia-600 hover:text-fuchsia-500"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
