import React, { useState, useEffect, useRef } from "react";
import { Dialog } from "@headlessui/react";
import { IoSearchSharp } from "react-icons/io5";
import {
  Bars3Icon,
  ShoppingBagIcon,
  XMarkIcon,
  UserCircleIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { navigation } from "../utils/items";
import { useAuth } from '../context/authContext';
import { useCart } from '../context/cartContext';
import { useSearch } from '../context/searchContext';
import { useOrders } from "../context/orderContext";
import { useProducts } from '../context/productContext';
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSearchFilters, setShowSearchFilters] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'newest'
  });
  const { categories } = useProducts();
  
  const { searchProducts } = useSearch();

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
            <div className="relative flex-1 max-w-3xl mx-auto" ref={searchRef}>
              <form onSubmit={handleSearch} className="flex">
                {/* Category Dropdown */}
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="h-full rounded-l-lg border-r border-gray-300 bg-gray-50 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                  >
                    <option value="">All</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Search Input */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full border-0 px-4 py-2.5 placeholder:text-gray-400 focus:ring-0"
                    placeholder="Search products..."
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="flex items-center bg-indigo-600 px-6 text-white hover:bg-indigo-700 rounded-r-lg"
                >
                  <IoSearchSharp className="h-5 w-5" />
                </button>
              </form>

              {/* Search Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion._id}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                    >
                      <img
                        src={suggestion.thumbnail}
                        alt={suggestion.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{suggestion.title}</p>
                        <p className="text-sm text-gray-500">${suggestion.price.current}</p>
                      </div>
                    </div>
                  ))}
                  <div 
                    className="px-4 py-2 bg-gray-50 text-center cursor-pointer hover:bg-gray-100"
                    onClick={handleSearch}
                  >
                    See all results for "{query}"
                  </div>
                </div>
              )}

              {/* Quick Category Access */}
              <div className="hidden lg:flex space-x-4 mt-2 text-sm text-gray-600">
                {categories.slice(0, 5).map(category => (
                  <button
                    key={category._id}
                    onClick={() => handleCategoryClick(category._id)}
                    className="hover:text-indigo-600 hover:underline"
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

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

            {/* Add Orders section to mobile menu */}
            {isLoggedIn && (
              <div className="px-4 py-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <Link 
                    to="/order-history"
                    className="flex items-center space-x-2 text-gray-700"
                    onClick={() => setOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span>| : ) Orders</span>
                  </Link>
                  {orders.length > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {orders.length}
                    </span>
                  )}
                </div>
              </div>
            )}
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

          {/* Desktop Search - Updated */}
          <div className="hidden md:flex items-center w-1/2 lg:w-2/5 xl:w-1/3">
            <div className="relative w-full" ref={searchRef}>
              <form onSubmit={handleSearch} className="flex w-full">
                {/* Category Dropdown */}
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="h-full rounded-l-lg border-r border-gray-300 bg-gray-50 px-4 text-gray-500 focus:outline-none"
                  >
                    <option value="">All</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

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
          </div>
        </div>
      </nav>
    </header>
  );
}
