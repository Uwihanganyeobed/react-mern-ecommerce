import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-zinc-700">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <a href="/" className="flex items-center">
              <img
                src="/assets/logo.png"
                width={100}
                alt="E-commerce Logo"
              />
            </a>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-4">
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Company
              </h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <a href="/about-us" className="hover:underline">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/careers" className="hover:underline">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Shop
              </h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <a href="/products" className="hover:underline">
                    All Products
                  </a>
                </li>
                <li>
                  <a href="/categories" className="hover:underline">
                    Categories
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Help
              </h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <a href="/customer-service" className="hover:underline">
                    Customer Service
                  </a>
                </li>
                <li>
                  <a href="/returns" className="hover:underline">
                    Returns
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Subscribe
              </h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <a href="#subscribe" className="hover:underline">
                    Newsletter
                  </a>
                </li>
                <li>
                  <a href="#privacy" className="hover:underline">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © 2023 E-commerce™. All Rights Reserved.
          </span>
          <div className="flex mt-4 sm:justify-center sm:mt-0 space-x-5">
            <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
              <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 8 19">
                <path d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z" />
              </svg>
              <span className="sr-only">Facebook page</span>
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
              <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 0a10 10..." />
              </svg>
              <span className="sr-only">Twitter account</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
