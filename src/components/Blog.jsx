import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Blog = () => {
  const blogs = [
    {
      id: 1,
      date: 'Oct 01, 2024',
      title: 'Top 5 Tips for Successful Online Shopping in Kigali',
      description: 'Learn how to navigate online shopping platforms effectively and make informed purchases.',
      imageUrl: '/assets/logo.png'
    },
    {
      id: 2,
      date: 'Oct 15, 2024',
      title: 'Understanding E-commerce Trends in Rwanda',
      description: 'Stay updated with the latest trends in e-commerce and how they can benefit your shopping experience.',
      imageUrl: '/assets/logo.png'

    },
    {
      id: 3,
      date: 'Oct 22, 2024',
      title: 'How to Choose the Right Products for Your Needs',
      description: 'A guide to selecting products that best fit your lifestyle and budget while shopping online.',
      imageUrl: '/assets/logo.png'

    }
  ];

  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <section className="py-24">
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
                  <a href="javascript:;" className="cursor-pointer text-lg text-indigo-600 font-semibold">
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