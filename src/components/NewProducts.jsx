import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css'; 

const NewProducts = () => {
  const products = [
    {
      id: 1,
      name: 'Trendy Jacket',
      price: '$100',
      category: "Women's Winter Wear",
      imageUrl: 'https://pagedone.io/asset/uploads/1700731972.png',
      rating: 4,
    },
    {
      id: 2,
      name: 'Black Blazer',
      price: '$100',
      category: "Men’s Suits",
      imageUrl: 'https://pagedone.io/asset/uploads/1700731993.png',
      rating: 5,
    },
    {
      id: 3,
      name: 'Red Flowers',
      price: '$100',
      category: 'Womenswear',
      imageUrl: 'https://pagedone.io/asset/uploads/1700732011.png',
      rating: 3,
    },
    {
      id: 4,
      name: 'Denim Jacket',
      price: '$100',
      category: 'Children Wear',
      imageUrl: 'https://pagedone.io/asset/uploads/1700732027.png',
      rating: 4,
    },
    {
      id: 5,
      name: 'Trendy Jacket',
      price: '$100',
      category: "Women's Winter Wear",
      imageUrl: 'https://pagedone.io/asset/uploads/1700731972.png',
      rating: 7,
    },
    {
      id: 6,
      name: 'Black Blazer',
      price: '$100',
      category: "Men’s Suits",
      imageUrl: 'https://pagedone.io/asset/uploads/1700731993.png',
      rating: 3,
    },
    {
      id: 7,
      name: 'Red Flowers',
      price: '$100',
      category: 'Womenswear',
      imageUrl: 'https://pagedone.io/asset/uploads/1700732011.png',
      rating: 10,
    },
    {
      id: 8,
      name: 'Denim Jacket',
      price: '$100',
      category: 'Children Wear',
      imageUrl: 'https://pagedone.io/asset/uploads/1700732027.png',
      rating: 5,
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4, // Show 4 cards at a time
    slidesToScroll: 4, // Scroll through 4 cards at a time
    autoplay: true, // Enable autoplay
    autoplaySpeed: 3000, // Set autoplay speed to 3 seconds
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2, // Show 2 cards on medium screens
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1, // Show 1 card on small screens
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section className="py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-manrope font-bold text-4xl text-black mb-8 max-xl:text-center">New Arrivals</h2>
        <Slider {...settings}>
          {products.map(product => (
            <div key={product.id} className="p-4">
              <a href="#1:" className="relative bg-white rounded-lg shadow-md overflow-hidden group cursor-pointer">
                <img className="rounded-t-lg object-cover w-full h-56" src={product.imageUrl} alt={`${product.name} image`} />
                <div className="p-4">
                  <h6 className="font-semibold text-base leading-7 text-black">{product.name}</h6>
                  <h6 className="font-semibold text-base leading-7 text-indigo-600 text-right">{product.price}</h6>
                  <p className="text-xs leading-5 text-gray-500">{product.category}</p>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, index) => (
                      <svg key={index} className={`h-4 w-4 ${index < product.rating ? 'text-orange-600' : 'text-gray-300'}`} aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 .587l3.668 7.429L24 9.188c.285.041.396.391.191.586l-5.93 5.773L19.399 24c.049.285-.248.506-.495.372L12 18.896l-7.642 4.006c-.247.134-.544-.087-.495-.372l1.399-8.151L0 .587c-.205-.195-.094-.545.191-.586l8.209-1.188L12 .587z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </a>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default NewProducts;