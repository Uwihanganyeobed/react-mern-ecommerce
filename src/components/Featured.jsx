import React from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const products = [
  {
    id: 1,
    name: 'Basic Tee',
    href: '/product/1',
    imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/product-page-01-related-product-01.jpg',
    imageAlt: "Front of men's Basic Tee in black.",
    price: '$35',
    color: 'Black',
    rating: 4,
  },
  {
    id: 2,
    name: 'Classic Hoodie',
    href: '/product/2',
    imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/product-page-01-related-product-02.jpg',
    imageAlt: "Front of Classic Hoodie in grey.",
    price: '$55',
    color: 'Grey',
    rating: 5,
  },
  {
    id: 3,
    name: 'Running Shoes',
    href: '/product/3',
    imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/product-page-01-related-product-04.jpg',
    imageAlt: 'Running Shoes in black and white.',
    price: '$120',
    color: 'Black/White',
    rating: 4.5,
  },
  {
    id: 4,
    name: 'Denim Jacket',
    href: '/product/4',
    imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/product-page-01-related-product-03.jpg',
    imageAlt: 'Front of Denim Jacket.',
    price: '$75',
    color: 'Blue',
    rating: 4,
  },
  {
    id: 5,
    name: 'Sport Shoes',
    href: '/product/5',
    imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/product-page-01-related-product-04.jpg',
    imageAlt: 'Sport Shoes in black and white.',
    price: '$115',
    color: 'Black',
    rating: 4.5,
  },
  {
    id: 6,
    name: 'Leather Jacket',
    href: '/product/6',
    imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/product-page-01-related-product-05.jpg',
    imageAlt: 'Leather Jacket.',
    price: '$150',
    color: 'Black',
    rating: 5,
  },
  {
    id: 7,
    name: 'Sunglasses',
    href: '/product/7',
    imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/product-page-01-related-product-06.jpg',
    imageAlt: 'Cool sunglasses.',
    price: '$80',
    color: 'Black',
    rating: 4,
  },
  {
    id: 8,
    name: 'Wristwatch',
    href: '/product/8',
    imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/product-page-01-related-product-07.jpg',
    imageAlt: 'Elegant wristwatch.',
    price: '$200',
    color: 'Gold',
    rating: 5,
  },
];

export default function Featured() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024, // For tablets and small desktops
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768, // For medium-sized screens
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480, // For small mobile screens
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // Helper function to render rating stars
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`h-4 w-4 ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.68h4.905c.969 0 1.371 1.24.588 1.81l-3.97 2.907 1.518 4.681c.3.922-.755 1.688-1.54 1.11l-3.97-2.906-3.97 2.906c-.784.578-1.838-.188-1.54-1.11l1.518-4.68-3.97-2.907c-.784-.57-.38-1.81.588-1.81h4.905l1.518-4.68z" />
        </svg>
      );
    }
    return stars;
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Featured Products
        </h2>

        {/* Slick Carousel */}
        <div className="mt-6">
          <Slider {...settings}>
            {products.map((product) => (
              <div key={product.id} className="px-2">
                <div className="group relative">
                  {/* Rating */}
                  <div className="absolute top-2 left-2 flex">
                    {renderStars(product.rating)}
                  </div>
                  
                  {/* Image with Hover */}
                  <Link to={product.href}>
                    <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80 cursor-pointer">
                      <img
                        alt={product.imageAlt}
                        src={product.imageSrc}
                        className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                      />
                    </div>
                  </Link>

                  <div className="mt-4 flex justify-between">
                    <div>
                      <h3 className="text-sm text-gray-700">
                        <Link to={product.href}>
                          <span aria-hidden="true" className="absolute inset-0" />
                          {product.name}
                        </Link>
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">{product.color}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {product.price}
                    </p>
                  </div>

                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
}
