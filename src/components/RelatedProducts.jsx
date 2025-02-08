import React from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';

// Sample related products
const relatedProducts = [
  {
    id: "1",
    name: "Sony WH-1000XM5",
    category: "Headphones",
    image: "/images/sony_headphones.jpg",
    new_price: 349.99,
    rating: 5,
  },
  {
    id: "2",
    name: "Dell XPS 15",
    category: "Laptops",
    image: "/images/dell_xps.jpg",
    new_price: 1899.99,
    rating: 4,
  },
  {
    id: "3",
    name: "Apple Watch Ultra",
    category: "Wearables",
    image: "/images/apple_watch.jpg",
    new_price: 799.99,
    rating: 5,
  }
];

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: Math.min(relatedProducts.length, 3),
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
};

export default function RelatedProducts() {
  return (
    <section className="py-8" id="relatedProducts">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="font-bold text-2xl text-gray-800 mb-4">Related Products</h2>
        <Slider {...settings}>
          {relatedProducts.map(product => (
            <div key={product.id} className="p-4">
              <Link to={`/product/${product.id}`} className="block bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <img className="object-cover w-full h-56" src={product.image} alt={product.name} />
                <div className="p-4">
                  <h6 className="font-semibold text-lg text-gray-900">{product.name}</h6>
                  <span className="text-lg font-bold text-indigo-600">${product.new_price}</span>
                </div>
              </Link>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}
