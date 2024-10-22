export const products = [
  {
    id: 1,
    name: "Basic Tee",
    imageSrc:
      "https://tailwindui.com/plus/img/ecommerce-images/product-page-01-related-product-01.jpg",
    imageAlt: "Front of men's Basic Tee in black.",
    price: "$35",
    color: "Black",
  },
  // {
  //   id: 2,
  //   name: "Classic Hoodie",
  //   imageSrc:
  //     "https://tailwindui.com/plus/img/ecommerce-images/product-page-01-related-product-02.jpg",
  //   imageAlt: "Front of Classic Hoodie in grey.",
  //   price: "$55",
  //   color: "Grey",
  // },
  // {
  //   id: 3,
  //   name: "Running Shoes",
  //   imageSrc:
  //     "https://tailwindui.com/plus/img/ecommerce-images/product-page-01-related-product-04.jpg",
  //   imageAlt: "Running Shoes in black and white.",
  //   price: "$120",
  //   color: "Black/White",
  // },
  // {
  //   id: 4,
  //   name: "Denim Jacket",
  //   imageSrc:
  //     "https://tailwindui.com/plus/img/ecommerce-images/product-page-01-related-product-03.jpg",
  //   imageAlt: "Front of Denim Jacket.",
  //   price: "$75",
  //   color: "Blue",
  // },
  // {
  //   id: 5,
  //   name: "Running Shoes",
  //   imageSrc:
  //     "https://tailwindui.com/plus/img/ecommerce-images/product-page-01-related-product-04.jpg",
  //   imageAlt: "Running Shoes in black and white.",
  //   price: "$120",
  //   color: "Black/White",
  // },
];
export const slides = [
  {
    title: "Boost your productivity.",
    img: "/assets/home.jpg",
  },
  {
    title: "Maximize efficiency.",
    img: "/assets/friday.jpg",
  },
];
export const callouts = [
  {
    name: "Desk and Office",
    imageSrc:
      "https://tailwindui.com/plus/img/ecommerce-images/home-page-02-edition-01.jpg",
    imageAlt:
      "Desk with leather desk pad, walnut desk organizer, wireless keyboard and mouse, and porcelain mug.",
    href: "/",
  },
  {
    name: "Self-Improvement",
    imageSrc:
      "https://tailwindui.com/plus/img/ecommerce-images/home-page-02-edition-02.jpg",
    imageAlt:
      "Wood table with porcelain mug, leather journal, brass pen, leather key ring, and a houseplant.",
    href: "/",
  },
  {
    name: "Travel",
    imageSrc:
      "https://tailwindui.com/plus/img/ecommerce-images/home-page-02-edition-03.jpg",
    imageAlt: "Collection of four insulated travel bottles on wooden shelf.",
    href: "/",
  },
  {
    name: "Fitness",
    imageSrc:
      "https://tailwindui.com/plus/img/ecommerce-images/product-page-01-related-product-01.jpg", // Replace with a valid image URL
    imageAlt:
      "Yoga mat and fitness equipment including dumbbells and a water bottle.",
    href: "/",
  },
  {
    name: "Cooking Essentials",
    imageSrc:
      "https://tailwindui.com/plus/img/ecommerce-images/product-page-01-related-product-04.jpg", // Replace with a valid image URL
    imageAlt:
      "Kitchen countertop with various cooking utensils and fresh ingredients.",
    href: "/",
  },
];
export const navigation = {
  categories: [
    { id: "deals", name: "Deals", href: "/deals" },
    { id: "about", name: "About", href: "/about" },
    { id: "blog", name: "Blog", href: "/blog" },
    { id: "contact", name: "Contact", href: "/contact" },
  ],
};

export const cartProducts = [
  {
    id: 1,
    name: "Throwback Hip Bag",
    href: "/",
    color: "Salmon",
    price: "$90.00",
    quantity: 1,
    imageSrc:
      "https://tailwindui.com/plus/img/ecommerce-images/shopping-cart-page-04-product-01.jpg",
    imageAlt:
      "Salmon orange fabric pouch with match zipper, gray zipper pull, and adjustable hip belt.",
  },
  {
    id: 2,
    name: "Medium Stuff Satchel",
    href: "/",
    color: "Blue",
    price: "$32.00",
    quantity: 1,
    imageSrc:
      "https://tailwindui.com/plus/img/ecommerce-images/shopping-cart-page-04-product-02.jpg",
    imageAlt:
      "Front of satchel with blue canvas body, black straps and handle, drawstring top, and front zipper pouch.",
  },
  // More products...
];

export const countires = [
  {
    id: 1,
    name: "Rwanda",
  },
  {
    id: 2,
    name: "USA",
  },
  {
    id: 3,
    name: "UAE",
  },
  {
    id: 4,
    name: "TZ",
  },
  {
    id: 5,
    name: "UK",
  },
];
export const monoProducts = {
  name: 'Basic Tee 6-Pack',
  price: '$192',
  href: '#',
  breadcrumbs: [
    { id: 1, name: 'Men', href: '#' },
    { id: 2, name: 'Clothing', href: '#' },
  ],
  images: [
    {
      src: 'https://tailwindui.com/plus/img/ecommerce-images/product-page-02-secondary-product-shot.jpg',
      alt: 'Two each of gray, white, and black shirts laying flat.',
    },
    {
      src: 'https://tailwindui.com/plus/img/ecommerce-images/product-page-02-tertiary-product-shot-01.jpg',
      alt: 'Model wearing plain black basic tee.',
    },
    {
      src: 'https://tailwindui.com/plus/img/ecommerce-images/product-page-02-tertiary-product-shot-02.jpg',
      alt: 'Model wearing plain gray basic tee.',
    },
    {
      src: 'https://tailwindui.com/plus/img/ecommerce-images/product-page-02-featured-product-shot.jpg',
      alt: 'Model wearing plain white basic tee.',
    },
  ],
  colors: [
    { name: 'White', class: 'bg-white', selectedClass: 'ring-gray-400' },
    { name: 'Gray', class: 'bg-gray-200', selectedClass: 'ring-gray-400' },
    { name: 'Black', class: 'bg-gray-900', selectedClass: 'ring-gray-900' },
  ],
  sizes: [
    { name: 'XXS', inStock: false },
    { name: 'XS', inStock: true },
    { name: 'S', inStock: true },
    { name: 'M', inStock: true },
    { name: 'L', inStock: true },
    { name: 'XL', inStock: true },
    { name: '2XL', inStock: true },
    { name: '3XL', inStock: true },
  ],
  description:
    'The Basic Tee 6-Pack allows you to fully express your vibrant personality with three grayscale options. Feeling adventurous? Put on a heather gray tee. Want to be a trendsetter? Try our exclusive colorway: "Black". Need to add an extra pop of color to your outfit? Our white tee has you covered.',
  highlights: [
    'Hand cut and sewn locally',
    'Dyed with our proprietary colors',
    'Pre-washed & pre-shrunk',
    'Ultra-soft 100% cotton',
  ],
  details:
    'The 6-Pack includes two black, two white, and two heather gray Basic Tees. Sign up for our subscription service and be the first to get new, exciting colors, like our upcoming "Charcoal Gray" limited release.',
}
export const monoReviews = { href: '#', average: 4, totalCount: 117 }

