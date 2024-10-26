import React from 'react';
import {aboutStats as stats} from "../utils/items"
const About = () => {
  

  return (
    <section className="py-24 relative"id='about'>
      <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
        <div className="w-full justify-start items-center gap-12 grid lg:grid-cols-2 grid-cols-1">
          {/* Images Grid */}
          <div className="w-full justify-center items-start gap-6 grid sm:grid-cols-2 grid-cols-1 lg:order-first order-last">
            <div className="pt-24 lg:justify-center sm:justify-end justify-start items-start gap-2.5 flex">
              <img 
                className="rounded-xl object-cover" 
                src="/assets/about/about.png" // Update with your image URL
                alt="Team collaboration in e-commerce" 
              />
            </div>
            <img 
              className="sm:ml-0 ml-auto rounded-xl object-cover" 
              src="/assets/blog/blog2.jpeg" // Update with your image URL              // Update with your image URL
              alt="E-commerce office environment" 
            />
          </div>

          {/* Content Section */}
          <div className="w-full flex-col justify-center lg:items-start items-center gap-10 inline-flex">
            <div className="w-full flex-col justify-center items-start gap-8 flex">
              {/* Heading and Description */}
              <div className="w-full flex-col justify-start lg:items-start items-center gap-3 flex">
                <h2 className="text-gray-900 text-4xl font-bold font-manrope leading-normal lg:text-start text-center">
                  Empowering E-commerce in Rwanda
                </h2>
                <p className="text-gray-500 text-base font-normal leading-relaxed lg:text-start text-center">
                  At KFLS, we believe in creating a seamless online shopping experience. Our commitment to quality and customer satisfaction drives us to continuously improve our offerings and services.
                </p>
              </div>

              {/* Stats Section */}
              <div className="w-full lg:justify-start justify-center items-center sm:gap-10 gap-5 inline-flex">
                {stats.map((stat, index) => (
                  <div key={index} className="flex-col justify-start items-start inline-flex">
                    <h4 className="text-gray-900 text-4xl font-bold font-manrope leading-normal">
                      {stat.value}
                    </h4>
                    <h6 className="text-gray-500 text-base font-normal leading-relaxed">
                      {stat.label}
                    </h6>
                  </div>
                ))}
              </div>
            </div>

            {/* Mission and Vision Section */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-indigo-100 rounded-full">
                  <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2a10 10 0 0110 10v6.4c0 .8-.5 1.3-1.3 1.4H3.3C2.5 20 2 19.5 2 18.6V12a10 10 0 0110-10zm1 10V8a1 1 0 10-2 0v4H8a1 1 0 000 2h3v4a1 1 0 002 0v-4h3a1 1 0 100-2h-3z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-800">Our Mission</h3>
                <p className="text-gray-500">
                  To provide Rwandans with a reliable and convenient online shopping platform that meets their needs while supporting local businesses.
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-indigo-100 rounded-full">
                  <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4a6 6 0 100 12 6 6 0 000-12zm0 10a4 4 0 110-8 4 4 0 010 8z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-800">Our Vision</h3>
                <p className="text-gray-500">
                  To be the leading e-commerce platform in Rwanda, known for our exceptional service and commitment to customer satisfaction.
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <button 
              className="sm:w-fit w-full px-3.5 py-2 bg-indigo-600 hover:bg-indigo-800 transition-all duration-700 ease-in-out rounded-lg shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] justify-center items-center flex mt-10"
              onClick={() => console.log('Read More clicked')}
            >
              <span className="px-1.5 text-white text-sm font-medium leading-6">
                Read More
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
    );
};

export default About;