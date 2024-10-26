
export const blogSettings = {
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

export const featuredSettings = {
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
       breakpoint: 1024,
       settings: {
         slidesToShow: 3,
         slidesToScroll: 1,
       },
     },
     {
       breakpoint: 768,
       settings: {
         slidesToShow: 2,
         slidesToScroll: 1,
       },
     },
     {
       breakpoint: 480,
       settings: {
         slidesToShow: 1,
         slidesToScroll: 1,
       },
     },
   ],
 };

 export const categorySettings = {
   dots: true,
   infinite: true,
   speed: 500,
   slidesToShow: 3, // Show 3 categories at a time
   slidesToScroll: 1,
   autoplay: true, // Enable autoplay
   autoplaySpeed: 3000, // Set autoplay speed to 3 seconds
   responsive: [
     {
       breakpoint: 1024,
       settings: {
         slidesToShow: 2, // Show 2 items on medium screens
         slidesToScroll: 1,
       },
     },
     {
       breakpoint: 600,
       settings: {
         slidesToShow: 1, // Show 1 item on small screens
         slidesToScroll: 1,
       },
     },
   ],
 };

 export const newSettings = {
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