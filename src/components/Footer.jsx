import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", isSuccess: false });

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ ...toast, show: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://react-mern-back-end.onrender.com/feedback/sub', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      setToast({
        show: true,
        message: data.message,
        isSuccess: true
      });
      setEmail("");
    } catch (error) {
      setToast({
        show: true,
        message: "Something went wrong. Please try again.",
        isSuccess: false
      });
    }
  };

  return (
    <footer className="w-full bg-slate-100 py-10 border-t">
      {toast.show && (
        <div className="fixed top-4 right-4 flex items-center gap-2 bg-white p-4 rounded-lg shadow-lg border border-gray-200 animate-slide-in">
          {toast.isSuccess ? (
            <img 
              src="/assets/success-sticker.gif" // Replace with your sticker image path
              alt="Success"
              className="w-8 h-8"
            />
          ) : (
            <svg className="w-6 h-6 text-red-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          )}
          <p className={`text-sm ${toast.isSuccess ? 'text-green-600' : 'text-red-600'}`}>
            {toast.message}
          </p>
        </div>
      )}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 py-10">
          {/* Column 1: Logo and Contact */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <img
                src="/assets/logo.png"
                alt="KFLS Logo"
                className="w-10 h-10 mr-3"
              />
              <h2 className="text-2xl font-bold text-gray-900">KFLS</h2>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              Trusted in more than 100 countries & 5 million customers. Have any
              query?
            </p>
            <Link
              to="/contact"
              className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-full text-sm"
            >
              Contact us
            </Link>
          </div>

          {/* Column 2: KFLS Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">KFLS</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-gray-900 text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-600 hover:text-gray-900 text-sm"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-gray-600 hover:text-gray-900 text-sm"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Products Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Products</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/collections"
                  className="text-gray-600 hover:text-gray-900 text-sm"
                >
                  Collections
                </Link>
              </li>
              <li>
                <Link
                  to="/categories"
                  className="text-gray-600 hover:text-gray-900 text-sm"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  to="/cshape"
                  className="text-gray-600 hover:text-gray-900 text-sm"
                >
                  Color & Shape
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Support Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-gray-900 text-sm"
                >
                  Customer Support
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-gray-900 text-sm"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-gray-900 text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Subscribe Section */}
          <div>
            <h3 className="text-lg font-bold mb-4">Subscribe</h3>
            <p className="text-gray-500 text-sm mb-4">
              Subscribe to get the latest news from us
            </p>
            <form onSubmit={handleSubmit} className="flex items-start justify-center gap-2 flex-col">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <button
                type="submit"
                className="inline-block border border-indigo-600 text-indigo-600 px-4 py-2 rounded-full text-sm hover:bg-indigo-600 hover:text-white transition-colors"
              >
                Subscribe →
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t pt-8 mt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            ©KFLS 2024, All rights reserved.
          </p>
          
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              {/* Twitter Icon */}
              <svg
                className="h-6 w-6"
                fill="blue"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
              </svg>
            </Link>
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              {/* Instagram Icon */}
              <svg
                className="h-6 w-6"
                fill="orchid"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 1.5A4.25 4.25 0 003.5 7.75v8.5A4.25 4.25 0 007.75 20.5h8.5A4.25 4.25 0 0020.5 16.25v-8.5A4.25 4.25 0 0016.25 3.5h-8.5zM12 7a5 5 0 100 10 5 5 0 000-10zm0 1.5a3.5 3.5 0 110 7 3.5 3.5 0 010-7zm5.25-.88a1.125 1.125 0 11-2.25 0 1.125 1.125 0 012.25 0z" />
              </svg>
            </Link>
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              {/* Facebook Icon */}
              <svg
                className="h-6 w-6"
                fill="aqua"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M22.67 12a10.67 10.67 0 10-12.33 10.53v-7.45h-2.6v-3.08h2.6V9.34c0-2.57 1.53-4 3.87-4 1.12 0 2.29.2 2.29.2v2.52h-1.29c-1.27 0-1.66.79-1.66 1.6v1.91h2.83l-.45 3.08h-2.38v7.45A10.67 10.67 0 0022.67 12z" />
              </svg>
            </Link>
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              {/* YouTube Icon */}
              <svg
                className="h-6 w-6"
                fill="red"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M23.498 6.186a2.99 2.99 0 00-2.107-2.112C19.672 3.5 12 3.5 12 3.5s-7.672 0-9.391.574a2.99 2.99 0 00-2.108 2.112C0 7.92 0 12 0 12s0 4.081.501 5.814a2.99 2.99 0 002.107 2.113C4.328 20.5 12 20.5 12 20.5s7.672 0 9.391-.573a2.99 2.99 0 002.108-2.113C24 16.08 24 12 24 12s0-4.08-.502-5.814zM9.75 15.02v-6.04L15.5 12l-5.75 3.02z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
