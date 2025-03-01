import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
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
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainPage />} />
      <Route path="/register" element={<Form type="signup" />} />
      <Route path="/register/confirmation" element={<RegisterConfirmation />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />
      <Route path="/login" element={<Form type="login" />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Protected Routes */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/order-confirmation"
        element={
          <ProtectedRoute>
            <OrderConfirmation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/order-history"
        element={
          <ProtectedRoute>
            <OrderHistory />
          </ProtectedRoute>
        }
      />

      {/* Static Routes */}
      <Route path="/one" element={<Reviews />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/blog" element={<Blog />} />

      {/* Product Routes */}
      <Route path="/product/:id" element={<MonoProduct />} />
      <Route path="/blog/:id" element={<MonoProduct />} />
      <Route path="/featured/:id" element={<MonoProduct />} />
      <Route path="/new/:id" element={<MonoProduct />} />
      <Route path="/category/:id" element={<MonoProduct />} />

      {/* Order Details Route */}
      <Route
        path="/order/:id"
        element={
          <ProtectedRoute>
            <OrderDetails />
          </ProtectedRoute>
        }
      />

      {/* 404 Route - Must be last */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
