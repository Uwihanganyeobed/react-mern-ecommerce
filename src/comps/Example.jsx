import React, { useState, useEffect } from "react";
import { slides } from "../utils/items";

export default function Example() {
  const [currentSlide, setCurrentSlide] = useState(0);
 

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide === 0 ? 1 : 0));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-10">
        
        <div className="relative isolate overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 px-6 pt-16 shadow-lg sm:rounded-1xl sm:px-16 py-10 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">

          <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {slides[currentSlide].title}
              <br />
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Ac euismod vel sit maecenas id pellentesque eu sed consectetur.
              Malesuada adipiscing sagittis vel nulla.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
              <a
                href="#"
                className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 transition-all duration-300"
              >
                Shop Now
              </a>
            </div>
          </div>
          <div className="relative mt-16 h-80 lg:mt-8">
            <div className="absolute inset-0 bg-gradient-to-tr from-gray-100/30 to-transparent rounded-lg"></div>
            <img
              alt="App screenshot"
              src={slides[currentSlide].img}
              className="absolute left-0 top-10 w-[550px] h-[350px] max-w-none rounded-lg bg-white shadow-lg ring-1 ring-gray-200 object-cover transition-transform duration-500 hover:scale-[1.02]"
            />
          </div>
        </div>
        {/* Pagination Controls */}
        <div className="mt-8 flex justify-center gap-x-4">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`h-2 transition-all duration-300 rounded-full ${
                currentSlide === index
                  ? "w-8 bg-gray-900"
                  : "w-2 bg-gray-300 hover:bg-gray-400"
              }`}
              onClick={() => handleSlideChange(index)}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
}