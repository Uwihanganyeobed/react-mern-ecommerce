import React, { useState, useEffect, useRef } from "react";
import { Dialog } from "@headlessui/react";
import { IoSearchSharp } from "react-icons/io5";
import {
  Bars3Icon,
  ShoppingBagIcon,
  XMarkIcon,
  UserCircleIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { Link, useNavigate } from "react-router-dom";
import { navigation } from "../utils/items";
import { useAuth } from '../context/authContext';
import { useCart } from '../context/cartContext';
import { useSearch } from '../context/searchContext';
import { useOrders } from "../context/orderContext";
import { useProducts } from '../context/productContext';
import { useUser } from '../context/userContext';
import { useClickOutside } from '../hooks/useClickOutside';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, isLoggedIn, logout, loading } = useAuth();
  const { orders } = useOrders();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const searchRef = useRef(null);
  const { categories } = useProducts();
  const { wishlist } = useUser();
  
  const { searchProducts } = useSearch();

  const userMenuRef = useRef(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Close suggestions when clicking outside
  useClickOutside(searchRef, () => setShowSuggestions(false));

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 2) {
        try {
          const results = await searchProducts({ 
            q: query,
            category: selectedCategory 
          });
          setSuggestions(results.slice(0, 5)); // Show only first 5 suggestions
          setShowSuggestions(true);
        } catch (error) {
          console.error("Search error:", error);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, selectedCategory]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuRef]);

  const handleSearch = (e) => {
    e.preventDefault();
    const searchParams = new URLSearchParams();
    if (query) searchParams.set('q', query);
    if (selectedCategory) searchParams.set('category', selectedCategory);
    navigate(`/search?${searchParams.toString()}`);
    setShowSuggestions(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    navigate(`/product/${suggestion._id}`);
    setShowSuggestions(false);
    setQuery("");
  };

  const handleCategoryClick = (category) => {
    const searchParams = new URLSearchParams();
    searchParams.set('category', category);
    navigate(`/search?${searchParams.toString()}`);
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

  const handleProfileClick = (e) => {
    console.log("Profile link clicked");
    // If you're using event handlers, make sure they're working correctly
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

      {/* Mobile menu - Enhanced */}
      <Dialog as="div" className="lg:hidden" open={open} onClose={setOpen}>
        <div className="fixed inset-0 z-50" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link to="/" className="-m-1.5 p-1.5" onClick={() => setOpen(false)}>
              <span className="sr-only">Your Company</span>
              <img src="/assets/logo.png" alt="Logo" width={120} />
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          
          {/* User Info for Mobile */}
          {isLoggedIn && (
            <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
              <div className="flex items-center space-x-3">
                <UserCircleIcon className="h-10 w-10 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Mobile Navigation Links */}
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              {/* Mobile Search */}
              <div className="py-6">
                <div className="relative" ref={searchRef}>
                  <form onSubmit={handleSearch} className="flex w-full">
                    {/* Search Input */}
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="w-full border border-gray-300 px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Search products..."
                      />
                      {query && (
                        <button
                          type="button"
                          onClick={() => setQuery("")}
                          className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>

                    {/* Search Button */}
                    <button
                      type="submit"
                      className="flex items-center bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                    >
                      <IoSearchSharp className="h-5 w-5" />
                    </button>
                  </form>

                  {/* Search Suggestions Dropdown */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
                      {suggestions.map((suggestion) => (
                        <div
                          key={suggestion._id}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                        >
                          <img
                            src={suggestion.thumbnail || suggestion.images?.[0]}
                            alt={suggestion.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="ml-4 flex-1">
                            <p className="text-sm font-medium text-gray-900 line-clamp-1">
                              {suggestion.title}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {suggestion.category}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                              <p className="text-sm font-medium text-indigo-600">
                                ${suggestion.price?.current}
                              </p>
                              {suggestion.rating && (
                                <div className="flex items-center">
                                  <span className="text-yellow-400">★</span>
                                  <span className="text-sm text-gray-600 ml-1">
                                    {suggestion.rating.average} ({suggestion.rating.count})
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div 
                        className="px-4 py-3 bg-gray-50 text-center cursor-pointer hover:bg-gray-100 text-indigo-600 font-medium"
                        onClick={handleSearch}
                      >
                        See all results for "{query}"
                      </div>
                    </div>
                  )}

                  {/* Quick Categories */}
                  <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-600">
                    {categories.slice(0, 5).map(category => (
                      <button
                        key={category._id}
                        onClick={() => {
                          handleCategoryClick(category._id);
                          setOpen(false);
                        }}
                        className="hover:text-indigo-600 hover:underline whitespace-nowrap"
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2 py-6">
                {navigation.categories.map((category) => (
                  <Link
                    key={category.name}
                    to={category.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    onClick={() => setOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
              
              {/* Mobile Quick Actions */}
              <div className="py-6 space-y-2">
                {/* Wishlist for Mobile - Enhanced */}
                {isLoggedIn && (
                  <Link
                    to="/wishlist"
                    className="flex items-center justify-between -mx-3 rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    onClick={() => setOpen(false)}
                  >
                    <div className="flex items-center">
                      <HeartIcon className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
                      <span>Wishlist</span>
                    </div>
                    {wishlist?.length > 0 && (
                      <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {wishlist.length}
                      </span>
                    )}
                  </Link>
                )}
                
                {/* Cart for Mobile - Enhanced */}
                {isLoggedIn && (
                  <Link
                    to="/cart"
                    className="flex items-center justify-between -mx-3 rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    onClick={() => setOpen(false)}
                  >
                    <div className="flex items-center">
                      <ShoppingBagIcon className="h-6 w-6 text-indigo-500 mr-3 flex-shrink-0" />
                      <span>Cart</span>
                    </div>
                    {cartItems?.length > 0 && (
                      <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {cartItems.length}
                      </span>
                    )}
                  </Link>
                )}
                
                {/* Orders for Mobile - Enhanced */}
                {isLoggedIn && (
                  <Link
                    to="/order-history"
                    className="flex items-center justify-between -mx-3 rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    onClick={() => setOpen(false)}
                  >
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <span>Orders</span>
                    </div>
                    {orders.length > 0 && (
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {orders.length}
                      </span>
                    )}
                  </Link>
                )}
                
                {/* Profile & Logout for Mobile */}
                {isLoggedIn ? (
                  <>
                    <Link
                      to="/profile"
                      className="flex items-center -mx-3 rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setOpen(false)}
                    >
                      <UserCircleIcon className="h-6 w-6 text-gray-600 mr-3 flex-shrink-0" />
                      <span>Profile</span>
                    </Link>
                    
                    <button
                      onClick={() => {
                        handleLogout();
                        setOpen(false);
                      }}
                      className="flex w-full items-center -mx-3 rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-red-600 hover:bg-red-50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="flex items-center -mx-3 rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setOpen(false)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      <span>Login</span>
                    </Link>
                    <Link
                      to="/register"
                      className="flex items-center -mx-3 rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setOpen(false)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      <span>Register</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </Dialog.Panel>
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

          {/* Desktop Search - Updated */}
          <div className="hidden md:flex items-center w-1/2 lg:w-2/5 xl:w-1/3">
            <div className="relative w-full" ref={searchRef}>
              <form onSubmit={handleSearch} className="flex w-full">
             

                {/* Search Input */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full border border-l-0 border-gray-300 px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Search products..."
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="flex items-center bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700 rounded-r-lg"
                >
                  <IoSearchSharp className="h-5 w-5" />
                </button>
              </form>

              {/* Search Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion._id}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                    >
                      <img
                        src={suggestion.thumbnail || suggestion.images?.[0]}
                        alt={suggestion.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="ml-4 flex-1">
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">
                          {suggestion.title}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {suggestion.category}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-sm font-medium text-indigo-600">
                            ${suggestion.price?.current}
                          </p>
                          {suggestion.rating && (
                            <div className="flex items-center">
                              <span className="text-yellow-400">★</span>
                              <span className="text-sm text-gray-600 ml-1">
                                {suggestion.rating.average} ({suggestion.rating.count})
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div 
                    className="px-4 py-3 bg-gray-50 text-center cursor-pointer hover:bg-gray-100 text-indigo-600 font-medium"
                    onClick={handleSearch}
                  >
                    See all results for "{query}"
                  </div>
                </div>
              )}

              {/* Quick Categories */}
              <div className="absolute -bottom-8 left-0 right-0 flex space-x-4 text-sm text-gray-600">
                {categories.slice(0, 5).map(category => (
                  <button
                    key={category._id}
                    onClick={() => handleCategoryClick(category._id)}
                    className="hover:text-indigo-600 hover:underline whitespace-nowrap"
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Right Controls */}
          <div className="hidden lg:flex items-center space-x-4 ml-auto">
            {isLoggedIn && !loading && user ? (
              <>
                <Link
                  to="/profile"
                  onClick={handleProfileClick}
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

            {isLoggedIn && (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/order-history"
                  className="relative flex items-center"
                >
                  <span className="sr-only">Your Orders</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  {orders.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {orders.length}
                    </span>
                  )}
                </Link>
              </div>
            )}

            {/* Desktop Wishlist - Enhanced */}
            {isLoggedIn && (
              <Link 
                to="/wishlist" 
                className="group flex items-center p-2 relative"
                aria-label={`Wishlist with ${wishlist?.length || 0} items`}
              >
                <div className="relative inline-block">
                  {wishlist?.length > 0 ? (
                    <HeartSolid className="h-6 w-6 text-red-500 transition-transform duration-200 transform group-hover:scale-110" />
                  ) : (
                    <HeartIcon className="h-6 w-6 text-gray-600 group-hover:text-red-500 transition-colors duration-200" />
                  )}
                  {wishlist?.length > 0 && (
                    <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-600 flex items-center justify-center transform transition-transform group-hover:scale-110">
                      <span className="text-xs font-medium text-white">
                        {wishlist.length}
                      </span>
                    </span>
                  )}
                </div>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
