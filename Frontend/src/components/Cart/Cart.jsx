import { useEffect, useState } from "react";
import axios from "../../api/axios";
import useCart from "../../hooks/useCart";
import { IoClose } from "react-icons/io5";
import { CartItems } from "./CartItems";
import { Link } from "react-router-dom";
const GETPRODUCT_URL = "/api/products";
export const Cart = ({ isCartOpen }) => {
  const [products, setProducts] = useState([]);
  const { cartItems, handleCloseCart, getItemsQuantity  } = useCart();

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
  return (
    <div
      className={`relative z-10 ${isCartOpen ? "visible" : "hidden"}`}
      aria-labelledby="slide-over-title"
      role="dialog"
      aria-modal="true"
    
    
    >
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

      <div   className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <div className="pointer-events-auto w-screen max-w-md">
              <div     className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                  <div className="flex items-start justify-between">
                    <h2
                      className="text-lg font-medium text-gray-900"
                      id="slide-over-title"
                    >
                      Shopping cart
                    </h2>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        onClick={handleCloseCart}
                        className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                      >
                        <span className="absolute -inset-0.5"></span>
                        <span className="sr-only">Close panel</span>
                        <IoClose className="h-6 w-6" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-8">
                    <div className="flow-root">
                      <ul
                        role="list"
                        className="-my-6 divide-y divide-gray-200"
                      >
                        {cartItems.map((item) => {
                          const quantity = getItemsQuantity(item.id);
                          if (quantity > 0) {
                            return <CartItems key={item.id} {...item} />;
                          } else {
                            return null;
                          }
                        })}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Subtotal</p>
                    <p>
                      $
                      {cartItems.reduce((totol, cartItem) => {
                        const item = products.find((i) => i.id === cartItem.id);
                        return totol + (item?.price || 0) * cartItem.quantity;
                      }, 0)}
                    </p>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">
                    Shipping and taxes calculated at checkout.
                  </p>
                  <div className="mt-6">
                    <Link
                      to="/cart"
                      className="w-full rounded-md py-1.5 font-medium text-fuchsia-50  flex items-center justify-center  border border-transparent bg-fuchsia-600 px-6 text-base shadow-sm hover:bg-fuchsia-600/80"
                    >
                      View cart
                    </Link>
                    <Link
                      to="/checkout"
                      className="mt-2 w-full rounded-md py-1.5 font-medium text-fuchsia-50  flex items-center justify-center  border border-transparent bg-fuchsia-600 px-6 text-base shadow-sm hover:bg-fuchsia-600/80"
                    >
                      Checkout
                    </Link>
                  </div>
                  <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                    <p>
                      or
                      <button
                        type="button"
                        onClick={handleCloseCart}
                        className="font-medium text-fuchsia-500 hover:text-fuchsia-400"
                      >
                        Continue Shopping
                        <span aria-hidden="true"> &rarr;</span>
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
