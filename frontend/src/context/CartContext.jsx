// src/context/CartContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  const updateCart = (items) => {
    setCartItems(items);
    localStorage.setItem("cart", JSON.stringify(items));
  };

  const addToCart = (item) => {
    const existing = cartItems.find(i => i._id === item._id);
    let updatedCart;

    if (existing) {
      updatedCart = cartItems.map(i =>
        i._id === item._id ? { ...i, quantity: (i.quantity || 1) + 1 } : i
      );
    } else {
      updatedCart = [...cartItems, { ...item, quantity: 1 }];
    }

    updateCart(updatedCart);
  };

  const getTotalCount = () =>
    cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, updateCart, addToCart, getTotalCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
