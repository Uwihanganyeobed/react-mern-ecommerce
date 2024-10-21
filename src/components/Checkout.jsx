import React from "react";
import { countires } from "../utils/items";
import { Link } from "react-router-dom";

export default function Checkout() {
  return (
    <div className="min-h-screen bg-blue-50 flex flex-col justify-center py-12">
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left side - Contact, Shipping, Delivery, Payment */}
          <div>
            {/* Contact Information */}
            <h2 className="text-lg font-semibold mb-4">Contact information</h2>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="example: abcd@example.com"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Shipping Information */}
            <h2 className="text-lg font-semibold mt-6 mb-4">
              Shipping information
            </h2>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    First name
                  </label>
                  <input
                    type="text"
                    placeholder="example: obed"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Last name
                  </label>
                  <input
                    type="text"
                    placeholder="example: Vragas"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Company
                </label>
                <input
                  type="text"
                  placeholder="example: google (optional)"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  placeholder="example: KN212st"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <input
                    type="text"
                    placeholder="example: Kigali"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <select className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    {countires.map((country) => (
                      <option key={country.id} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    State / Province
                  </label>
                  <input
                    type="text"
                    placeholder="example: NY"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Postal code
                  </label>
                  <input
                    type="text"
                    placeholder="example: 1234"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="text"
                  placeholder="example: +2507800000"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Delivery Method */}
            <h2 className="text-lg font-semibold mt-6 mb-4">Delivery method</h2>
            <div className="bg-white p-6 rounded-lg shadow mb-4 flex flex-col sm:flex-row justify-between items-center">
              <div className="flex flex-col justify-between items-center border-2 rounded-lg p-4 w-full sm:w-1/2 sm:mr-4 mb-4 sm:mb-0 cursor-pointer hover:border-indigo-600 transition duration-150">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="delivery"
                    className="form-radio h-4 w-4 text-indigo-600"
                    checked
                  />
                  <span className="ml-2 font-semibold">Standard</span>
                </label>
                <p className="text-gray-600 text-sm">4-10 business days</p>
                <p className="mt-2 font-bold text-lg">$5.00</p>
              </div>

              <div className="flex flex-col justify-between items-center border-2 rounded-lg p-4 w-full sm:w-1/2 cursor-pointer hover:border-indigo-600 transition duration-150">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="delivery"
                    className="form-radio h-4 w-4 text-indigo-600"
                  />
                  <span className="ml-2 font-semibold">Express</span>
                </label>
                <p className="text-gray-600 text-sm">2-5 business days</p>
                <p className="mt-2 font-bold text-lg">$16.00</p>
              </div>
            </div>

            {/* Payment Method */}
            <h2 className="text-lg font-semibold mb-4">Payment</h2>
            <div className="bg-white p-6 rounded-lg shadow flex flex-row items-center justify-evenly mb-5">
              
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="payment"
                    className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                    checked
                  />
                  <span className="ml-2">Credit card</span>
                </label>
              </div>
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="payment"
                    className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                  />
                  <span className="ml-2">PayPal</span>
                </label>
              </div>
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="payment"
                    className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                  />
                  <span className="ml-2">eTransfer</span>
                </label>
              </div>
              </div>
              <div>

              <div className="mb-4">
                <label className="block text-lg font-medium text-gray-700 italic">
                  Card number
                </label>
                <input
                  type="text"
                  placeholder="example: 34388--900-00"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div className="mb-4">
                <label className="block text-lg italic font-medium text-gray-700">
                  Name on card
                </label>
                <input
                  type="text"
                  placeholder="example: cardName"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-lg italic font-medium text-gray-700">
                    Expiration date (MM/YY)
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-lg italic font-medium text-gray-700">
                    CVC
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Order Summary */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex">Order summary</h2>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="mb-4 flex gap-2 flex-col">
                <div className="flex justify-between text-lg font-medium">
                  <p>Subtotal</p>
                  <p>$120.00</p>
                </div>
                <div className="flex justify-between text-lg font-semibold text-gray-700">
                  <p>Shipping</p>
                  <p>$5.00</p>
                </div>
                <div className="flex justify-between text-lg font-medium">
                  <p>Taxes</p>
                  <p>$10.00</p>
                </div>
              </div>
              <div className="border-t border-gray-200 py-4">
                <div className="flex justify-between text-xl font-bold">
                  <p>Total</p>
                  <p className="text-gray-700">$135.00</p>
                </div>
              </div>
              <Link to='/order'>
              <button className="w-full bg-indigo-600 text-white py-3 rounded-lg mt-6 hover:bg-indigo-700 transition duration-150 ease-in-out">
                Place order
              </button>
              </Link>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
