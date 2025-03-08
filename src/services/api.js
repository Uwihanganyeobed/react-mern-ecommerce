import axios from 'axios';

// const API_URL = 'http://localhost:5000';
const API_URL = 'https://react-mern-back-end.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Token management
const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

const removeAuthToken = () => {
  delete api.defaults.headers.common['Authorization'];
};

// Auth endpoints
const auth = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => api.post(`/auth/reset-password/${token}`, { password: newPassword }),
  changePassword: (currentPassword, newPassword) => api.post('/auth/change-password', { currentPassword, newPassword }),
  verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
  resendVerification: () => api.post('/auth/resend-verification'),
  checkUserRole: () => api.get('/auth/check-role')
};

// User endpoints
const user = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (profileData) => api.put('/users/profile', profileData),
  deleteAccount: () => api.delete('/users/profile'),
  
  // Address management
  getAddresses: () => api.get('/users/addresses'),
  addAddress: (addressData) => api.post('/users/addresses', addressData),
  updateAddress: (addressId, addressData) => api.put(`/users/addresses/${addressId}`, addressData),
  deleteAddress: (addressId) => api.delete(`/users/addresses/${addressId}`),
  
  // Wishlist management
  getWishlist: () => api.get('/users/wishlist'),
  addToWishlist: (productId) => api.post(`/users/wishlist/${productId}`),
  removeFromWishlist: (productId) => api.delete(`/users/wishlist/${productId}`)
};

// Product endpoints
const product = {
  /*----------------------------------------*/ 
  searchProducts: (params) => {
    // Clean up params to remove empty values
    const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});

    console.log('API Search Params:', cleanParams); // Debug log
    return api.get('/products/search', { params: cleanParams });
  },
  /*featured*/ 
  getFeaturedProducts: () => api.get('/products/featured'),
  getFeaturedProduct: (id) => api.get(`/products/featured/${id}`),
  /*category*/ 
  getProductsByCategory: (category, params) => 
    api.get(`/products/category/${category}`, { params }),
  getCategories: () => api.get('/products/categories'),
  getCategoryProduct: (id) => api.get(`/products/product/${id}`),
  /*featured*/ 
  getAvailableProducts: () => api.get('/products/available'),
  getTopRatedProducts: () => api.get('/products/top-rated'),
  getPaginatedProducts: (page) => api.get(`/products/page/${page}`),
  getBlogProduct: (id) => api.get(`/products/blog/${id}`),
  
  /*new*/ 
  getNewProduct: (id) => api.get(`/products/new/${id}`),
  getNewProducts: () => api.get('/products/new'),

  sortProducts: (params) => api.get('/products/sort', { 
    params: {
      sortBy: params.sortBy,
      category: params.category,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
      inStock: params.inStock
    }
  }),
  filterProductsByPriceRange: (params) => {
    const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});

    console.log('API Filter Params:', cleanParams); // Debug log
    return api.get('/products/filter/price', { params: cleanParams });
  },
  
  // Product Detail Routes
  getProductById: (id) => api.get(`/products/${id}`),
  getRelatedProducts: (id) => api.get(`/products/${id}/related`),
  getProductReviews: (id) => api.get(`/products/${id}/reviews`),
  addProductReview: (id, reviewData) => api.post(`/products/${id}/reviews`, reviewData)
};
// Cart endpoints
const cart = {
  getCart: () => api.get('/cart'),
  addToCart: (cartItem) => api.post('/cart/add', cartItem),
  updateCartItem: (itemId, quantity) => api.put(`/cart/items/${itemId}`, { quantity }),
  removeCartItem: (itemId) => api.delete(`/cart/items/${itemId}`),
  clearCart: () => api.delete('/cart')
};

// Order endpoints
const order = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getMyOrders: () => api.get('/orders/my-orders'),
  getOrderById: (orderId) => api.get(`/orders/${orderId}`),
  cancelOrder: (orderId) => api.put(`/orders/${orderId}/cancel`),
  getOrderStatusUpdates: (orderId) => api.get(`/orders/${orderId}/status-updates`),
  getOrderTracking: (orderId) => api.get(`/orders/${orderId}/tracking`),
  processPayment: (orderId) => api.post(`/orders/${orderId}/payment`),
  getOrderPaymentStatus: (orderId) => api.get(`/orders/${orderId}/payment-status`)
};

// Payment endpoints
const payment = {
  createPaymentIntent: () => api.post('/payments/create-intent'),
  verifyPayment: () => api.post('/payments/verify'),
  getPaymentStatus: () => api.get('/payments/status/:paymentId')
};

// Coupon endpoints
const coupon = {
  validateCoupon: (couponCode) => api.post('/coupons/validate', { code: couponCode })
};

// Contact endpoints
const contact = {
  submitContact: (contactData) => api.post('/contacts', contactData),
  getMyContacts: () => api.get('/contacts/my-contacts')
};

// Subscription endpoints
const subscription = {
  subscribe: () => api.post('/subscribers/subscribe'),
  unsubscribe: (token) => api.post(`/subscribers/unsubscribe/${token}`),
  verifySubscription: (token) => api.get(`/subscribers/verify/${token}`)
};



export { 
  api, 
  setAuthToken, 
  removeAuthToken, 
  auth, 
  user, 
  product, 
  cart, 
  order, 
  coupon, 
  contact, 
  subscription 
};

