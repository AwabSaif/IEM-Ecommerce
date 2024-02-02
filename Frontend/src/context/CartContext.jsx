import { createContext, useEffect, useState } from "react";
import { Cart } from "../components/Cart/Cart";

export const CartContext = createContext({});

const initialCartItems = localStorage.getItem("iem-Cart")
  ? JSON.parse(localStorage.getItem("iem-Cart"))
  : [];

const CartProvider = ({ children }) => {
  const [cartItems, setCartITems] = useState(initialCartItems);

  useEffect(() => {
    localStorage.setItem("iem-Cart", JSON.stringify(cartItems));
  }, [cartItems]);
  //handel cart open
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleRemoveCartAfterOrder = () => {
    setCartITems([]);
  };
  
  const handleCloseCart = () => {
    setIsCartOpen(false);
  };

  const handleOpenCart = () => {
    setIsCartOpen(true);
  };

  // Cart Quantity
  const CartQuantity = cartItems.reduce(
    (quantity, item) => item.quantity + quantity,
    0
  );

  //   console.log(cartItems);
  const getItemsQuantity = (id) => {
    return cartItems.find((item) => item.id === id)?.quantity || 0;
  };
  const increaseCartQuantity = (id) => {
    return setCartITems((currItems) => {
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
  const decreaseCartQuantity = (id) => {
    return setCartITems((currItems) => {
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
  const removeItemFromCart = (id) => {
    setCartITems((currItems) => currItems.filter((item) => item.id !== id));
  };
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
      {children}
      <Cart isCartOpen={isCartOpen} />
    </CartContext.Provider>
  );
};

export default CartProvider;
