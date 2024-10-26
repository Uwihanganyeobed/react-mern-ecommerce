import React, { useEffect, useState } from "react";
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
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      // Optionally verify token here or just set logged in state
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginStatusChange = (status) => {
    setIsLoggedIn(status);
  };


  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar isLoggedIn={isLoggedIn} onLoginStatusChange={handleLoginStatusChange} />
        <div className="flex flex-col flex-grow">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/register" element={<Form type='signup' onLoginStatusChange={handleLoginStatusChange} />} />
            <Route path="/login" element={<Form type='login' onLoginStatusChange={handleLoginStatusChange} />} />
            <Route path="/:id" element={<MonoProduct />} />
            <Route path="/blog/:id" element={<MonoProduct />} />
            <Route path="/featured/:id" element={<MonoProduct />} />
            <Route path="/new/:id" element={<MonoProduct />} />
            <Route path="/category/:id" element={<MonoProduct />} />
            <Route path="/one" element={<Reviews />} />
            <Route path="/order" element={<OrderHistroy />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
          </Routes>
        </div>
        <Footer />
        <ToastContainer /> {/* ToastContainer for displaying toasts */}
      </div>
    </BrowserRouter>
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
}