import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product, size) => {
    setCart((prev) => {
      const item = prev.find(
        (p) => p.id === product.id && p.size === size
      );
      if (item) {
        return prev.map((p) =>
          p.id === product.id && p.size === size
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }
      return [...prev, { ...product, size, quantity: 1 }];
    });
  };

  const removeFromCart = (id, size) =>
    setCart((prev) =>
      prev.filter((p) => !(p.id === id && p.size === size))
    );

  const hydrateCart = (cartFromDB) => setCart(cartFromDB || []);
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, hydrateCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
