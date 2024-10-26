import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {blogs} from '../utils/items'
import {blogSettings as settings} from "../utils/slickSettings"
const Blog = () => {
 
  return (
    <section className="py-24"id="blog">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-manrope text-4xl font-bold text-gray-900 text-center mb-16">Latest Insights from KFLS</h2>
        <Slider {...settings}>
          {blogs.map((blog) => (
            <div key={blog.id} className="px-4">
              <div className="group w-full border border-gray-300 rounded-2xl">
                <div className="flex items-center">
                  <img
                    src={blog.imageUrl}
                    alt={blog.title}
                    className="rounded-t-2xl w-full object-cover"
                  />
                </div>
                <div className="p-4 lg:p-6 transition-all duration-300 rounded-b-2xl group-hover:bg-gray-50">
                  <span className="text-indigo-600 font-medium mb-3 block">{blog.date}</span>
                  <h4 className="text-xl text-gray-900 font-medium leading-8 mb-5">{blog.title}</h4>
                  <p className="text-gray-500 leading-6 mb-10">{blog.description}</p>
                  <a href="/" className="cursor-pointer text-lg text-indigo-600 font-semibold">
                    Read more...
                  </a>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Blog;