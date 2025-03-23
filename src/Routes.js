import { Routes, Route } from "react-router-dom";
import PersistLogin from "./components/PersistLogin";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Form from "./components/Form";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import OrderConfirmation from "./components/OrderConfirmation";
import MonoProduct from "./components/MonoProduct";
import Reviews from "./components/Reviews";
import SearchResults from "./components/Searchresults";
import About from "./components/About";
import Contact from "./components/Contact";
import Blog from "./components/Blog";
import NotFound from "./components/NotFound";
import VerifyEmail from "./components/VerifyEmail";
import Headings from "./components/Headings";
import Featured from "./components/Featured";
import NewProducts from "./components/NewProducts";
import RegisterConfirmation from "./components/RegisterConfirmation";
import Profile from "./components/Profile";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import Categories from "./components/Categories";
import OrderDetails from "./components/OrderDetails";
import OrderHistory from "./components/OrderHistory";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from './components/PaymentForm';
import PaymentSuccess from './components/PaymentSuccess';
import Wishlist from './components/Wishlist';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// Main component definition
const MainPage = () => {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      <Headings />
      <Featured />
      {/* <CategoryProducts /> */}
      <Categories />
      <NewProducts />
    </div>
  );
};

export default function AppRoutes() {
  console.log("Rendering AppRoutes");
  
  return (
    <Routes>
      <Route element={<PersistLogin />}>
        {/* Public Routes */}
        <Route path="/" element={<MainPage />} />
        <Route path="/register" element={<Form type="signup" />} />
        <Route path="/register/confirmation" element={<RegisterConfirmation />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/login" element={<Form type="login" />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/product/:id" element={<MonoProduct />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/one" element={<Reviews />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/order/:id" element={<OrderDetails />} />
          <Route path="/order/:id/payment" element={
            <Elements stripe={stripePromise}>
              <PaymentForm />
            </Elements>
          } />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Route>

        {/* 404 Route - Must be last */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
