// Importing the useContext hook from the React library
import { useContext } from "react";
// Importing the CartContext from the specified path
import { CartContext } from "../context/CartContext";

// Custom hook named useCart
const useCart = () => {
  // Using the useContext hook to access the CartContext
  // This hook provides access to the context value provided by the nearest <CartProvider> component
  // The CartContext contains the state and functions related to the shopping cart
  return useContext(CartContext);
};

// Exporting the useCart hook to be used in other components
export default useCart;
