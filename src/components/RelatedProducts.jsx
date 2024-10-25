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
    // Fetch related products based on the current product ID
    fetch(`http://localhost:5000/products/${id}/related/`)
      .then(response => response.json())
      .then(data => setRelatedProducts(data))
      .catch(error => console.error("Error fetching related products:", error));
  }, [id]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4, // Show 4 items at once
    slidesToScroll: 4, // Scroll through 4 items at once
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2, // Show 2 items on medium screens
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1, // Show 1 item on small screens
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (relatedProducts.length === 0) {
    return (
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-manrope font-bold text-4xl text-black mb-8 max-xl:text-center">Related Products</h2>
          <Slider {...settings}>
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="p-4">
                <Skeleton height={224} className="rounded-lg mb-2" />
                <Skeleton height={20} width={`80%`} />
                <Skeleton height={20} width={`50%`} />
                <Skeleton height={15} width={`60%`} />
              </div>
            ))}
          </Slider>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gray-50" id='relatedProducts'>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-manrope font-bold text-4xl text-black mb-8 max-xl:text-center">Related Products</h2>
        <Slider {...settings}>
          {relatedProducts.map(product => (
            <div key={product._id} className="p-4">
              <Link to={`/new/${product._id}`} className="relative bg-white rounded-lg shadow-md overflow-hidden group cursor-pointer">
                <img className="rounded-t-lg object-cover w-full h-56" src={product.image} alt={product.name} />
                <div className="p-4">
                  <h6 className="font-semibold text-base leading-7 text-black">{product.name}</h6>
                  <h6 className="font-semibold text-base leading-7 text-indigo-600 text-right">${product.new_price}</h6>
                  <p className="text-xs leading-5 text-gray-500">{product.category}</p>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, index) => (
                      <svg key={index} className={`h-4 w-4 ${index < product.rating ? 'text-orange-600' : 'text-gray-300'}`} aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
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