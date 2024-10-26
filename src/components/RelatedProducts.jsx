import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css'; 
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; 
import { Link } from 'react-router-dom';

const RelatedProducts = ({ id }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/products/${id}/related/`)
      .then(response => response.json())
      .then(data => {
        // Remove duplicates based on the product ID
        const uniqueProducts = Array.from(new Set(data.map(product => product._id)))
          .map(id => {
            return data.find(product => product._id === id);
          });
        setRelatedProducts(uniqueProducts);
      })
      .catch(error => console.error("Error fetching related products:", error));
  }, [id]);

  // Determine the number of slides to show based on the available products
  const slidesToShow = Math.min(relatedProducts.length, 3);
  
  const settings = {
    dots: false,
    infinite: relatedProducts.length > slidesToShow, // Infinite scroll only if more items than slidesToShow
    speed: 500,
    slidesToShow: slidesToShow, // Dynamically set slidesToShow
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1, // Show 1 item on smaller screens
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(relatedProducts.length, 2), // Show 2 items on medium screens
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (relatedProducts.length === 0) {
    return (
      <section className="py-8">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-bold text-2xl text-gray-800 mb-4">Related Products</h2>
          <Slider {...settings}>
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="p-4">
                <Skeleton height={200} className="rounded-lg mb-2" />
                <Skeleton height={20} width="80%" />
                <Skeleton height={15} width="50%" />
                <Skeleton height={15} width="60%" />
              </div>
            ))}
          </Slider>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8" id="relatedProducts">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="font-bold text-2xl text-gray-800 mb-4">Related Products</h2>
        <Slider {...settings}>
          {relatedProducts.map(product => (
            <div key={product._id} className="p-4">
              <Link to={`/new/${product._id}`} className="block bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <img className="object-cover w-full h-56" src={product.image} alt={product.name} />
                <div className="p-4">
                  <h6 className="font-semibold text-lg text-gray-900">{product.name}</h6>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-500">{product.category}</span>
                    <span className="text-lg font-bold text-indigo-600">${product.new_price}</span>
                  </div>
                  <div className="flex items-center mt-2">
                    {[...Array(5)].map((_, index) => (
                      <svg key={index} className={`h-4 w-4 ${index < product.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 .587l3.668 7.429L24 9.188c.285.041.396.391.191.586l-5.93 5.773L19.399 24c.049.285-.248.506-.495.372L12 18.896l-7.642 4.006c-.247.134-.544-.087-.495-.372l1.399-8.151L0 .587c-.205-.195-.094-.545.191-.586l8.209-1.188L12 .587z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default RelatedProducts;
