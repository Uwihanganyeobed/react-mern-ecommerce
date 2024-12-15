
export const blogs = [
  {
    id: 1,
    date: 'Oct 01, 2024',
    title: 'Top 5 Tips for Successful Online Shopping in Kigali',
    description: 'Learn how to navigate online shopping platforms effectively and make informed purchases.',
    imageUrl: '/assets/blog/blog1.jpeg'
  },
  {
    id: 2,
    date: 'Oct 15, 2024',
    title: 'Understanding E-commerce Trends in Rwanda',
    description: 'Stay updated with the latest trends in e-commerce and how they can benefit your shopping experience.',
    imageUrl: '/assets/blog/blog2.jpeg'

  },
  {
    id: 3,
    date: 'Oct 22, 2024',
    title: 'How to Choose the Right Products for Your Needs',
    description: 'A guide to selecting products that best fit your lifestyle and budget while shopping online.',
    imageUrl: '/assets/blog/blog3.jpeg'

  }
];

export const navigation = {
  categories: [
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

export const aboutStats = [
  { value: "5+", label: "Years in E-commerce" },
  { value: "200+", label: "Products Offered" },
  { value: "1000+", label: "Satisfied Customers" }
];