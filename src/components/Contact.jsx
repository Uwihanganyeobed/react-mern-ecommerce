import React from 'react';
import { Link } from 'react-router-dom';

const Contact = () => {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-10">
          
          {/* Left Section with Image and Contact Info */}
          <div className="relative h-full">
            <img
              src="/assets/logo.png" // Update this path with your logo
              alt="Contact KFLS"
              className="w-full h-full lg:rounded-l-2xl rounded-2xl object-cover bg-indigo-700"
            />
            <h1 className="absolute top-11 left-11 text-4xl font-bold text-white font-manrope">
              Contact Us
            </h1>
            <div className="absolute bottom-0 w-full p-5 lg:p-11">
              <div className="bg-white p-6 rounded-lg">
                
                {/* Phone Number */}
                <Link to="/" className="flex items-center mb-6">
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22.3092 18.3098C22.0157 18.198 21.8689 18.1421 21.7145 18.1287C21.56 18.1154 21.4058 18.1453 21.0975 18.205L17.8126 18.8416C17.4392 18.9139 17.2525 18.9501 17.0616 18.9206C16.8707 18.891 16.7141 18.8058 16.4008 18.6353C13.8644 17.2551 12.1853 15.6617 11.1192 13.3695C10.9964 13.1055 10.935 12.9735 10.9133 12.8017C10.8917 12.6298 10.9218 12.4684 10.982 12.1456L11.6196 8.72559C11.6759 8.42342 11.7041 8.27233 11.6908 8.12115C11.6775 7.96998 11.6234 7.82612 11.5153 7.5384L10.6314 5.18758C10.37 4.49217 10.2392 4.14447 9.95437 3.94723C9.6695 3.75 9.29804 3.75 8.5551 3.75H5.85778C4. . . ."
                    />
                  </svg>
                  <h5 className="ml-5 text-base font-normal text-black leading-6">
                    +250-788-123456
                  </h5>
                </Link>

                {/* Email Address */}
                <Link to="#" className="flex items-center mb-6">
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* SVG path for email icon */}
                  </svg>
                  <h5 className="ml-5 text-base font-normal text-black leading-6">
                    support@kfleshop.rw
                  </h5>
                </Link>

                {/* Location */}
                <Link to="#" className="flex items-center">
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* SVG path for location icon */}
                  </svg>
                  <h5 className="ml-5 text-base font-normal text-black leading-6">
                    Kigali, Rwanda
                  </h5>
                </Link>

              </div>
            </div>
          </div>
          
          {/* Right Section with Contact Form */}
          <div className="bg-gray-50 p-5 lg:p-11 lg:rounded-r-2xl rounded-2xl">
            <h2 className="text-4xl font-semibold font-manrope text-indigo-600 leading-10 mb-11">
              Send Us A Message
            </h2>
            
            {/* Name Input */}
            <input
              type="text"
              className="w-full h-12 mb-10 pl-4 text-lg font-normal text-gray-600 placeholder-gray-400 shadow-sm bg-transparent border border-gray-200 rounded-full focus:outline-none"
              placeholder="Your Name"
            />

            {/* Phone Number Input */}
            <input
              type="text"
              className="w-full h-12 mb-10 pl-4 text-lg font-normal text-gray-600 placeholder-gray-400 shadow-sm bg-transparent border border-gray-200 rounded-full focus:outline-none"
              placeholder="Your Phone Number"
            />

            {/* Email Input */}
            <input
              type="email"
              className="w-full h-12 mb-10 pl-4 text-lg font-normal text-gray-600 placeholder-gray-400 shadow-sm bg-transparent border border-gray-200 rounded-full focus:outline-none"
              placeholder="Your Email Address"
            />

            {/* Message Textarea */}
            <textarea
              className="w-full h-auto mb-8 pl-4 pt-4 text-lg font-normal text-gray-600 placeholder-gray-400 shadow-sm bg-transparent border border-gray-200 rounded-xl focus:outline-none"
              placeholder="Your Message"
              rows={6}
            ></textarea>

            {/* Submit Button */}
            <button
              className="w-full h-12 text-base font-normal text-white bg-indigo-600 rounded-full shadow-lg hover:bg-indigo-500 transition-colors"
            >
              Send Message
            </button>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
