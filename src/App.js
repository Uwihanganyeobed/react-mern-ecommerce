import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Headings from "./components/Headings";
import Featured from "./components/Featured";
import Categories from "./components/Categories";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Form from "./components/Form";
import MonoProduct from "./components/MonoProduct";
import Reviews from "./components/Reviews";
import OrderHistroy from "./components/OrderHistroy";
import About from "./components/About";
import Contact from "./components/Contact";
import Blog from "./components/Blog";
import NewProducts from "./components/NewProducts";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS
import ProtectedRoute from "./auth/protectedRoute";
import { AuthProvider } from "./context/authContext";
import { SearchProvider } from "./context/searchContext";
import SearchResults from "./components/Searchresults";

export default function App() {
  return (
    <AuthProvider>
      <SearchProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex flex-col flex-grow">
              <Routes>
                <Route path="/" element={<Main />} />
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
                <Route path="/register" element={<Form type="signup" />} />
                <Route path="/login" element={<Form type="login" />} />
                <Route path="/:id" element={<MonoProduct />} />
                <Route path="/blog/:id" element={<MonoProduct />} />
                <Route path="/featured/:id" element={<MonoProduct />} />
                <Route path="/new/:id" element={<MonoProduct />} />
                <Route path="/category/:id" element={<MonoProduct />} />
                <Route path="/one" element={<Reviews />} />
                <Route path="/search" element={<SearchResults />} />
                <Route
                  path="/order"
                  element={
                    <ProtectedRoute>
                      <OrderHistroy />
                    </ProtectedRoute>
                  }
                />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/blog" element={<Blog />} />
              </Routes>
            </div>
            <Footer />
            <ToastContainer /> {/* ToastContainer for displaying toasts */}
          </div>
        </BrowserRouter>
      </SearchProvider>
    </AuthProvider>
  );
}

const Main = () => {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      <Headings />
      <Featured />
      <Categories />
      <NewProducts />
    </div>
  );
};
