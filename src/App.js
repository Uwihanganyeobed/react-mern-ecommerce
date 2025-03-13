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
// import PaymentPage from './components/PaymentPage';
// import PaymentSuccess from './components/PaymentSuccess';
// import PaymentCancel from './components/PaymentCancel';

export default function App() {
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
                              <div className="flex flex-col flex-grow">
                                <AppRoutes /> {/* Use AppRoutes component */}
                              </div>
                              <Footer />
                              <ToastContainer />
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
