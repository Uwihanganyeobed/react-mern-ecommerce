import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import {
  Bars3Icon,
  ShoppingBagIcon,
  XMarkIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { navigation } from "../utils/items";
import { useAuth } from '../context/authContext';
import { useCart } from '../context/cartContext';
import { useSearch } from '../context/searchContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, isLoggedIn, logout, loading } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  let debounceTimer;
  const { searchProducts } = useSearch();

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    setQuery(searchTerm);
    
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      if (searchTerm.length > 2) {
        try {
          const results = await searchProducts({ q: searchTerm });
          setSuggestions(Array.isArray(results) ? results : []);
          setIsModalOpen(true);
        } catch (error) {
          console.error("Error fetching search suggestions:", error);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
        setIsModalOpen(false);
      }
    }, 300);
  };

  const handleSuggestionClick = (productId) => {
    setIsModalOpen(false);
    navigate(`/${productId}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setIsModalOpen(false);
    navigate(`/search?q=${query}`);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="bg-white text-semibold text-xl" id="home">
      {/* Announcement bar */}
      <div className="bg-indigo-600 text-white text-center py-2">
        Get free delivery on orders over $100
        {isLoggedIn && !loading && user && (
          <strong className="text-lg ml-10 text-yellow-300">
            Welcome {user.name}
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

            {/* Search Form */}
            <form onSubmit={handleSearchSubmit} className="relative flex w-full">
              <input
                type="text"
                value={query}
                onChange={handleSearchChange}
                placeholder="Search for products..."
                className="flex-grow px-2 py-1 border border-b-gray-400 rounded-l-lg text-lg focus:outline-none focus:border-gray-500 focus:bg-transparent"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-2 py-2 rounded-r-lg text-lg hover:bg-blue-700"
              >
                Search
              </button>
              
              {/* Suggestions Modal */}
              {isModalOpen && suggestions.length > 0 && (
                <div className="absolute top-full mt-1 bg-white border rounded-lg shadow-lg w-full z-10">
                  {suggestions.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => handleSuggestionClick(item._id)}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <div className="flex justify-between items-center">
                        <span>{item.name}</span>
                        <span className="text-gray-600">
                          {typeof item.price === 'object' 
                            ? `$${(item.price.current || item.price.original || 0).toFixed(2)}`
                            : `$${parseFloat(item.price || 0).toFixed(2)}`
                          }
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </form>

            {/* Account / Profile / Logout */}
            <div className="mt-4 space-y-2">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 text-lg font-medium text-gray-700 hover:text-blue-600"
                  >
                    <UserCircleIcon className="h-6 w-6" />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-lg font-medium text-gray-700 hover:text-red-600"
                  >
                    Logout
                  </button>
                </>
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
                Cart ({cartItems?.length || 0})
              </span>
              <div className="relative">
                <ShoppingBagIcon className="h-6 w-6 text-gray-400" />
                {cartItems?.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-600 flex items-center justify-center">
                    <span className="text-xs font-medium text-white">
                      {cartItems.length}
                    </span>
                  </span>
                )}
              </div>
            </Link>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Desktop navbar */}
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

          {/* Desktop Navigation */}
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

          {/* Desktop Search */}
          <div className="hidden md:flex items-center w-1/2 lg:w-2/5 xl:w-1/3">
            <form onSubmit={handleSearchSubmit} className="relative flex w-full">
              <input
                type="text"
                value={query}
                onChange={handleSearchChange}
                placeholder="Search for products..."
                className="flex-grow px-4 py-2 border rounded-l-lg text-lg focus:outline-none focus:border-gray-500 focus:bg-transparent"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-1 py-2 rounded-r-lg text-lg hover:bg-blue-700"
              >
                Search
              </button>
              
              {/* Suggestions Modal */}
              {isModalOpen && suggestions.length > 0 && (
                <div className="absolute top-full mt-1 bg-white border rounded-lg shadow-lg w-full z-10">
                  {suggestions.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => handleSuggestionClick(item._id)}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <div className="flex justify-between items-center">
                        <span>{item.name}</span>
                        <span className="text-gray-600">
                          {typeof item.price === 'object' 
                            ? `$${(item.price.current || item.price.original || 0).toFixed(2)}`
                            : `$${parseFloat(item.price || 0).toFixed(2)}`
                          }
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </form>
          </div>

          {/* Desktop Right Controls */}
          <div className="hidden lg:flex items-center space-x-4 ml-auto">
            {isLoggedIn && !loading && user ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
                  title="Profile"
                >
                  <UserCircleIcon className="h-6 w-6" />
                  <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-indigo-600">
                      {getInitials(user.name)}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-lg font-medium text-gray-700 hover:text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-lg font-medium text-gray-700 hover:text-blue-600"
              >
                Account
              </Link>
            )}

            <span className="h-6 w-px bg-gray-200" aria-hidden="true" />

            {/* Cart */}
            <Link to="/cart" className="group -m-2 flex items-center p-2 relative">
              <ShoppingBagIcon className="h-6 w-6 text-gray-600 group-hover:text-gray-800" />
              {cartItems?.length > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-orange-600 flex items-center justify-center">
                  <span className="text-xs font-medium text-white">
                    {cartItems.length}
                  </span>
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
