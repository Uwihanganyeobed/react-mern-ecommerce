import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { navigation } from "../utils/items";

export default function Navbar() {
  
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white text-semibold text-xl">
      {/* Announcement bar */}
      <div className="bg-indigo-600 text-white text-center py-2">
        Get free delivery on orders over $100
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
                  className="block p-2 font-medium text-gray-900"
                >
                  {category.name}
                </Link>
              ))}
            </div>

            {/* Search Bar */}
            <div className="mt-4 flex items-center">
              <input
                type="text"
                placeholder="Search..."
                className="flex-grow border border-gray-300 rounded-md py-2 pl-3 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <button
                type="submit"
                className="ml-2 p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                <MagnifyingGlassIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Cart Icon */}
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Cart (3)
              </span>{" "}
              {/* Change '3' to your dynamic cart count */}
              <div className="relative">
                <ShoppingBagIcon className="h-6 w-6 text-gray-400" />
                {/* Cart item count badge */}
                <span className="absolute top-0 right-0 inline-flex items-center justify-center h-4 w-4 bg-red-600 text-white text-xs font-bold rounded-full">
                  0
                </span>{" "}
                {/* Change '3' to your dynamic cart count */}
              </div>
            </div>
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
            <a href="#2">
              <img src="/assets/logo.png" alt="Logo" width={180} />
            </a>
          </div>

          {/* Left-Side Links (Desktop Only) */}
          <div className="hidden lg:flex lg:space-x-4 lg:mr-auto">
            {navigation.categories.map((category) => (
              <Link
                key={category.name}
                to={category.href}
                className="text-lg font-medium text-gray-700 hover:text-gray-800"
              >
                {category.name}
              </Link>
            ))}
            
          </div>

          {/* Search Bar (Desktop Only) */}
          <div className="hidden lg:flex lg:flex-grow lg:max-w-lg lg:justify-center mx-auto px-4">
            <input
              type="text"
              placeholder="Search..."
              className="w-full border border-gray-300 rounded-md py-2 pl-3 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-xs"
            />
            <button
              type="submit"
              className="ml-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Right-side Controls (Desktop Only) */}
          <div className="hidden lg:flex items-center space-x-4 ml-auto">
            <a
              href="#4"
              className="text-lg font-medium text-gray-700 hover:text-gray-800"
            >
              Sign in
            </a>
            <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
            <a
              href="#5"
              className="text-lg font-medium text-gray-700 hover:text-gray-800"
            >
              Create{" "}
            </a>
            <span className="h-6 w-px bg-gray-200" aria-hidden="true" />

            {/* Currency (CAD) with Flag */}
            {/* Currency Selector */}
            <div className="inline-flex items-center">
              <select className="border border-gray-300 rounded-md text-sm font-medium text-gray-700 focus:border-indigo-500 focus:ring-indigo-500">
                <option value="CAD" className="flex items-center">
                  <img
                    src="https://flagcdn.com/ca.svg"
                    alt="Canada Flag"
                    className="h-4 w-auto mr-1"
                  />{" "}
                  CAD
                </option>
                <option value="USD" className="flex items-center">
                  <img
                    src="https://flagcdn.com/us.svg"
                    alt="USA Flag"
                    className="h-4 w-auto mr-1"
                  />{" "}
                  USD
                </option>
                <option value="EUR" className="flex items-center">
                  <img
                    src="https://flagcdn.com/eu.svg"
                    alt="EU Flag"
                    className="h-4 w-auto mr-1"
                  />{" "}
                  EUR
                </option>
                <option value="GBP" className="flex items-center">
                  <img
                    src="https://flagcdn.com/gb.svg"
                    alt="UK Flag"
                    className="h-4 w-auto mr-1"
                  />{" "}
                  GBP
                </option>
                <option value="AUD" className="flex items-center">
                  <img
                    src="https://flagcdn.com/au.svg"
                    alt="Australia Flag"
                    className="h-4 w-auto mr-1"
                  />{" "}
                  AUD
                </option>
              </select>
            </div>

            {/* Cart Icon (Desktop Only) */}
            <div className="flex items-center ml-auto cursor-pointer">
              <ShoppingBagIcon className="h-6 w-6 text-gray-400" />
              <span className="ml-2 text-sm font-medium text-gray700">0</span>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
