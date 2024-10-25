// Importing necessary modules from React
import { createContext, useEffect, useState } from "react";
import { Cart } from "../components/Cart/Cart"; // Assuming Cart component is defined here

// Creating a context for managing cart state
export const CartContext = createContext({});

// Initializing cart items from localStorage or an empty array if not found
const initialCartItems = localStorage.getItem("iem-Cart")
  ? JSON.parse(localStorage.getItem("iem-Cart"))
  : [];

// CartProvider component responsible for managing cart state
const CartProvider = ({ children }) => {
  // State to manage cart items
  const [cartItems, setCartItems] = useState(initialCartItems);

  // Saving cart items to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("iem-Cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // State to manage cart open/close status
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Handler function to remove cart items after order completion
  const handleRemoveCartAfterOrder = () => {
    setCartItems([]);
  };

  // Handler function to close the cart
  const handleCloseCart = () => {
    setIsCartOpen(false);
  };

  // Handler function to open the cart
  const handleOpenCart = () => {
    setIsCartOpen(true);
  };

  // Calculating total quantity of items in the cart
  const CartQuantity = cartItems.reduce(
    (quantity, item) => item.quantity + quantity,
    0
  );

  // Function to get quantity of a specific item in the cart
  const getItemsQuantity = (id) => {
    return cartItems.find((item) => item.id === id)?.quantity || 0;
  };

  // Function to increase quantity of a specific item in the cart
  const increaseCartQuantity = (id) => {
    return setCartItems((currItems) => {
      if (currItems.find((item) => item.id === id) == null) {
        return [...currItems, { id, quantity: 1 }];
      } else {
        return currItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity + 1 };
          } else {
            return item;
          }
        });
      }
    });
  };

  // Function to decrease quantity of a specific item in the cart
  const decreaseCartQuantity = (id) => {
    return setCartItems((currItems) => {
      if (currItems.find((item) => item.id === id) == null) {
        return currItems.filter((item) => item.id !== id);
      } else {
        return currItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity - 1 };
          } else {
            return item;
          }
        });
      }
    });
  };

  // Function to remove a specific item from the cart
  const removeItemFromCart = (id) => {
    setCartItems((currItems) => currItems.filter((item) => item.id !== id));
  };

  // Providing cart state and handler functions to the context
  return (
    <CartContext.Provider
      value={{
        cartItems,
        getItemsQuantity,
        increaseCartQuantity,
        decreaseCartQuantity,
        removeItemFromCart,
        handleOpenCart,
        handleCloseCart,
        CartQuantity,
        handleRemoveCartAfterOrder,
      }}
    >
      {/* Rendering children components */}
      {children}
      {/* Rendering Cart component with cart open/close status */}
      <Cart isCartOpen={isCartOpen} />
    </CartContext.Provider>
  );
};

// Exporting CartProvider component as default
export default CartProvider;
