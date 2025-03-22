// import './i18n/i18n';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS
import { SearchProvider } from "./context/searchContext";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./Routes"; // Import AppRoutes
import { AuthProvider } from './context/authContext';
import { UserProvider } from './context/userContext';
import { ProductProvider } from './context/productContext';
import { CartProvider } from './context/cartContext';
import { OrderProvider } from './context/orderContext';
import { PaymentProvider } from './context/paymentContext';
import { CouponProvider } from './context/couponContext';
import { SubscriberProvider } from './context/subscriberContext';
import AuthDebug from './components/AuthDebug';
import React, { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    console.log("App component mounted");
    return () => console.log("App component unmounted");
  }, []);

  console.log("App rendering");
  
  return (
    <BrowserRouter>
      <AuthProvider>
        <UserProvider>
          <ProductProvider>
            <CartProvider>
              <OrderProvider>
                <PaymentProvider>
                  <CouponProvider>
                    <SubscriberProvider>
                      <SearchProvider>
                        <div className="flex flex-col min-h-screen">
                          <Navbar />
                          <div className="flex flex-col flex-grow bg-gray-50" style={{ minHeight: '500px' }}>
                            <AppRoutes />
                          </div>
                          <Footer />
                          <ToastContainer />
                          {process.env.NODE_ENV === 'development' && <AuthDebug />}
                        </div>
                      </SearchProvider>
                    </SubscriberProvider>
                  </CouponProvider>
                </PaymentProvider>
              </OrderProvider>
            </CartProvider>
          </ProductProvider>
        </UserProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
