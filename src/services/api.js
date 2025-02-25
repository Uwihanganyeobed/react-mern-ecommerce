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
  searchProducts: (query) => api.get('/products/search', { params: query }),
  getFeaturedProducts: () => api.get('/products/featured'),
  getProductsByCategory: (category) => api.get(`/products/category/${category}`),
  getCategoryProduct: (id) => api.get(`/products/product/${id}`),
  getAvailableProducts: () => api.get('/products/available'),
  getTopRatedProducts: () => api.get('/products/top-rated'),
  getPaginatedProducts: (page) => api.get(`/products/page/${page}`),
  getBlogProduct: (id) => api.get(`/products/blog/${id}`),
  getNewProduct: (id) => api.get(`/products/new/${id}`),
  getNewProducts: () => api.get('/products/new'),
  sortProducts: (sortParams) => api.get('/products/sort', { params: sortParams }),
  filterProductsByPriceRange: (minPrice, maxPrice) => api.get('/products/filter/price', { params: { minPrice, maxPrice } }),
  
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
  getOrderById: (id) => api.get(`/orders/${id}`),
  cancelOrder: (id) => api.put(`/orders/${id}/cancel`)
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

// Feedback endpoints
const feedback = {
  getPublicFeedback: () => api.get('/feedback/public'),
  submitFeedback: (feedbackData) => api.post('/feedback', feedbackData),
  getMyFeedback: () => api.get('/feedback/my-feedback'),
  updateFeedback: (id, feedbackData) => api.put(`/feedback/${id}`, feedbackData),
  deleteFeedback: (id) => api.delete(`/feedback/${id}`)
};

// Notification endpoints
const notification = {
  getMyNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
  updatePreferences: (preferences) => api.put('/notifications/preferences', preferences),
  createTestNotifications: () => api.post('/notifications/create')
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
  feedback, 
  notification, 
  subscription 
};

