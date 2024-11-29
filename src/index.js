import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./context/authContext";
import { CartProvider } from "./context/itemsContext";
import { OrderProvider } from "./context/ordersContext";
import { CheckoutProvider } from "./context/checkoutContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <OrderProvider>
          <CheckoutProvider>
            <App />
          </CheckoutProvider>
        </OrderProvider>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
