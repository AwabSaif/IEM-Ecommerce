import { useEffect, useState } from "react";
import useCart from "../../hooks/useCart";
import axios from "../../api/axios";

// Define the URL to fetch products
const GETPRODUCT_URL = "/api/products";

// Component for rendering individual cart items
export const CartItems = ({ id, quantity }) => {
  // Custom hook for handling cart operations
  const { increaseCartQuantity, decreaseCartQuantity, removeItemFromCart } =
    useCart();

  // State to hold product data
  const [products, setProducts] = useState([]);
  
  // Find the product with the given ID
  const item = products.find((i) => i.id === id);

  // Fetch product data from the server
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(GETPRODUCT_URL , { withCredentials: true });
        // Set the fetched product data to state
        setProducts(response.data);
      } catch (err) {
        // Handle errors if any
        if (err?.response) {
          console.log(err.response.data);
        } else {
          console.log(`Error: ${err.message}`);
        }
      }
    };
    fetchProducts();
  }, []); // Only run once when the component mounts

  // If the item is not found, return null
  if (!item) {
    return null;
  }

  return (
    <li className="flex py-6">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <img
          src={item.image}
          alt={item.image}
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            {/* Display product name and total price */}
            <h3>{item.name}</h3>
            <p className="ml-4">${item.price * quantity}</p>
          </div>
          {/* Display individual item price */}
          <p className="mt-1 text-sm text-gray-500">${item.price}</p>
        </div>
        <div className="flex flex-1  items-end justify-between text-sm">
          <div className="flex justify-center items-center gap-2">
            {/* Button to decrease quantity */}
            <button
              onClick={() => decreaseCartQuantity(id)}
              className="cursor-pointer rounded-md bg-fuchsia-100 py-1 px-3.5 duration-100 hover:bg-fuchsia-500 hover:text-fuchsia-50"
            >
              -
            </button>
            {/* Display item quantity */}
            <p className="text-gray-500">Qty {quantity}</p>
            {/* Button to increase quantity */}
            <button
              onClick={() => increaseCartQuantity(id, item.countInStock)}
              disabled={quantity >= item.countInStock}
              className="cursor-pointer rounded-md bg-fuchsia-100 py-1 px-3 duration-100 hover:bg-fuchsia-500 hover:text-fuchsia-50"
            >
              +
            </button>
          </div>
          <div className="flex">
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
    </li>
  );
};
