import React, { useState, useContext } from "react";
import { Dialog } from "@headlessui/react";
import {
  Bars3Icon,
  ShoppingBagIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { navigation } from "../utils/items";
import { AuthContext } from "../context/authContext";
import { useCart } from "../context/itemsContext";

export default function Navbar() {

  const [open, setOpen] = useState(false);
  const { isLoggedIn, userName, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [query, setQuery] = useState(""); // Search query
  const [suggestions, setSuggestions] = useState([]); // Suggestions array
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { cartItems } = useCart();
  
  let debounceTimer;

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    setQuery(searchTerm);
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      if (searchTerm.length > 2) {
        try {
          const response = await fetch(
            `https://react-mern-back-end.onrender.com/products/search?q=${searchTerm}`
          );
          const data = await response.json();
          setSuggestions(data);
          setIsModalOpen(true);
        } catch (error) {
          console.error("Error fetching search suggestions:", error);
        }
      } else {
        setSuggestions([]);
        setIsModalOpen(false);
      }
    }, 300); // Wait 300ms before making the API call
  };

  const handleSuggestionClick = (productId) => {
    setIsModalOpen(false); // Close modal
    navigate(`/${productId}`); // Navigate to product details page
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setIsModalOpen(false);
    navigate(`/search?q=${query}`); // Navigate to the search results page
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white text-semibold text-xl" id="home">
      {/* Announcement bar */}
      <div className="bg-indigo-600 text-white text-center py-2">
        Get free delivery on orders over $100
        {isLoggedIn && (
          <strong className="text-lg ml-10 text-yellow-300">
            {" "}
            Welcome {userName}{" "}
          </strong>
        )}
      </div>

      {/* Mobile menu */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        className="relative z-40 lg:hidden"
      >
        <div className="fixed inset-0 bg-black bg-opacity-25" />
        <div className="fixed inset-0 z-40 flex">
          <Dialog.Panel className="relative w-full max-w-xs bg-white p-6 shadow-xl">
            <button onClick={() => setOpen(false)} className="text-gray-400">
              <XMarkIcon className="h-6 w-6" />
            </button>

            {/* Navigation Links */}
            <div className="mt-6">
              {navigation.categories.map((category) => (
                <Link
                  key={category.name}
                  to={category.href}
                  className="block p-2 font-medium text-gray-900 hover:text-blue-600"
                  id={category.name}
                >
                  {category.name}
                </Link>
              ))}
            </div>
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex w-full"
            >
              <input
                type="text"
                value={query}
                onChange={handleSearchChange}
                placeholder="Search for products..."
                className="flex-grow px-2 py-1 border border-b-gray-400 rounded-l-lg text-lg focus:outline-none focus:border-gray-500 focus:bg-transparent" // Updated focus styles
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-2 py-2 rounded-r-lg text-lg hover:bg-blue-700" // Added button styling
              >
                Search
              </button>
              {/* Suggestions Modal */}
              {isModalOpen && (
                <div className="absolute top-full mt-1 bg-white border rounded-lg shadow-lg w-full z-10">
                  {suggestions.length > 0 ? (
                    suggestions.map((item) => (
                      <div
                        key={item._id}
                        onClick={() => handleSuggestionClick(item._id)}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {item.name}
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-gray-500">
                      No suggestions found
                    </div>
                  )}
                </div>
              )}
            </form>
            {/* Account / Logout */}
            <div className="mt-4">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="block w-full text-lg font-medium text-gray-700 hover:text-red-600"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="block w-full text-lg font-medium text-gray-700 hover:text-blue-600"
                >
                  Account
                </Link>
              )}
            </div>

            {/* Cart Icon */}
            <Link className="mt-4 flex items-center justify-between" to="/cart">
              <span className="text-sm font-medium text-gray-700">
                Cart ({cartItems.length})
              </span>
              <div className="relative">
                <ShoppingBagIcon className="h-6 w-6 text-gray-400" />
                <span className="absolute top-0 right-0 inline-flex items-center justify-center h-4 w-4 bg-red-600 text-white text-xs font-bold rounded-full">
                  {cartItems.length}
                </span>
              </div>
            </Link>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Top nav */}
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 border-b border-gray-200">
          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(true)}
            className="lg:hidden p-2 text-gray-400"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          {/* Logo */}
          <div className="flex items-center mr-auto mt-10">
            <Link to="/">
              <img src="/assets/logo.png" alt="Logo" width={180} />
            </Link>
          </div>

          {/* Left-Side Links (Desktop Only) */}
          <div className="hidden lg:flex lg:space-x-4 lg:mr-auto">
            {navigation.categories.map((category) => (
              <Link
                key={category.name}
                to={category.href}
                className="text-lg font-medium text-gray-700 hover:text-blue-600"
                id={category.name}
              >
                {category.name}
              </Link>
            ))}
          </div>

          {/* Search Bar (Desktop Only) */}
          <div className="hidden md:flex items-center w-1/2 lg:w-2/5 xl:w-1/3">
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex w-full"
            >
                           <input
                type="text"
                value={query}
                onChange={handleSearchChange}
                placeholder="Search for products..."
                className="flex-grow px-4 py-2 border rounded-l-lg text-lg focus:outline-none focus:border-gray-500 focus:bg-transparent" // Updated focus styles
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-1 py-2 rounded-r-lg text-lg hover:bg-blue-700" // Added button styling
              >
                Search
              </button>
              {/* Suggestions Modal */}
              {isModalOpen && (
                <div className="absolute top-full mt-1 bg-white border rounded-lg shadow-lg w-full z-10">
                  {suggestions.length > 0 ? (
                    suggestions.map((item) => (
                      <div
                        key={item._id}
                        onClick={() => handleSuggestionClick(item._id)}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {item.name}
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-gray-500">
                      No suggestions found
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>
          {/* Right-side Controls (Desktop Only) */}
          <div className="hidden lg:flex items-center space-x-4 ml-auto">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="text-lg font-medium text-gray700 hover:text-red600"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="text-lg font-medium text-gray700 hover:text-blue600"
              >
                Account
              </Link>
            )}

            <span className="h6 w-px bg-gray200" aria-hidden="true" />

            {/* Currency Selector and Cart Group */}
            <div className="flex items-center space-x-6">
              {/* Currency Selector */}
              <select className="border border-gray-300 rounded-md text-sm font-medium text-gray-700 focus:border-indigo-500 focus:ring-indigo-500 py-2">
                <option value="CAD">CAD</option>
                <option value="USD">USD</option>
              </select>

              {/* Enhanced Cart Icon */}
              <Link 
                to="/cart" 
                className="group -m-2 flex items-center p-2 relative"
                aria-label="View cart"
              >
                <ShoppingBagIcon className="h-6 w-6 text-gray-600 group-hover:text-gray-800" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-orange-600 flex items-center justify-center">
                    <span className="text-xs font-medium text-white">
                      {cartItems.length}
                    </span>
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
