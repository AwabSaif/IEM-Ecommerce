import { useEffect, useState } from "react";
import useCart from "../../hooks/useCart";
import axios from "../../api/axios";

const GETPRODUCT_URL = "/api/products";
export const CartItems = ({ id, quantity }) => {
  const { increaseCartQuantity, decreaseCartQuantity, removeItemFromCart } =
    useCart();
  //get data
  const [products, setProducts] = useState([]);
  const item = products.find((i) => i.id === id);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(GETPRODUCT_URL);

        setProducts(response.data);
      } catch (err) {
        if (err.response) {
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.headers);
        } else {
          console.log(`Error: ${err.message}`);
        }
      }
    };
    fetchProducts();
  }, [item]);

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
            <h3>{item.name}</h3>
            <p className="ml-4">${item.price * quantity}</p>
          </div>
          <p className="mt-1 text-sm text-gray-500">${item.price}</p>
        </div>
        <div className="flex flex-1  items-end justify-between text-sm">
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() => decreaseCartQuantity(id)}
              className="cursor-pointer rounded-md bg-fuchsia-100 py-1 px-3.5 duration-100 hover:bg-fuchsia-500 hover:text-fuchsia-50"
            >
              -
            </button>
            <p className="text-gray-500">Qty {quantity}</p>
            <button
              onClick={() => increaseCartQuantity(id)}
              className="cursor-pointer rounded-md bg-fuchsia-100 py-1 px-3 duration-100 hover:bg-fuchsia-500 hover:text-fuchsia-50"
            >
              +
            </button>
          </div>
          <div className="flex">
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
