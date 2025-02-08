import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./context/authContext";
import { CartProvider } from "./context/cartContext";
import { OrderProvider } from "./context/orderContext";
import { CheckoutProvider } from "./context/checkoutContext";
import { ProductProvider } from "./context/productContext";
import { SearchProvider } from "./context/searchContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <AuthProvider>
      <SearchProvider>
        <ProductProvider>
          <CartProvider>
            <OrderProvider>
              <CheckoutProvider>
                <App />
              </CheckoutProvider>
            </OrderProvider>
          </CartProvider>
        </ProductProvider>
      </SearchProvider>
    </AuthProvider>
);

reportWebVitals();
