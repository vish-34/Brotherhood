import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { CartProvider } from "./context/CartContext.jsx";
import { LikeProvider } from "./context/LikeContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CartProvider>
      <LikeProvider>
        <App />
      </LikeProvider>
    </CartProvider>
  </StrictMode>
);
