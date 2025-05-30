import axios from 'axios';

const API_URL = 
process.env.REACT_APP_API_URL
//  "http://localhost:5000";

// Ensure the API URL doesn't have a trailing slash
const api = axios.create({
  baseURL: API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Token management
const setAuthToken = (token) => {
  if (token) {
    console.log("Setting auth token in API service");
    // Ensure the token is properly formatted as a Bearer token
    const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    api.defaults.headers.common['Authorization'] = formattedToken;
    localStorage.setItem('token', token); // Store the original token
  } else {
    console.log("Removing auth token in API service");
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

const removeAuthToken = () => {
  console.log("Removing auth token in API service");
  delete api.defaults.headers.common['Authorization'];
  localStorage.removeItem('token');
};

// Initialize auth token from localStorage on app load
const initializeAuth = () => {
  const token = localStorage.getItem('token');
  if (token) {
    console.log("Initializing auth token from localStorage");
    // Ensure the token is properly formatted as a Bearer token
    const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    api.defaults.headers.common['Authorization'] = formattedToken;
    return true;
  }
  return false;
};

// Call this immediately
const tokenInitialized = initializeAuth();
console.log("Token initialized on load:", tokenInitialized);

// Token refresh mechanism
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Add interceptor for response errors
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // If error is not 401 or request has already been retried, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }
    
    if (isRefreshing) {
      // If token refresh is in progress, queue this request
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(token => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch(err => Promise.reject(err));
    }
    
    originalRequest._retry = true;
    isRefreshing = true;
    
    try {
      // Call your refresh token endpoint
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await api.post('/auth/refresh-token', { refreshToken });
      const { token } = response.data;
      
      localStorage.setItem('token', token);
      setAuthToken(token);
      
      // Update authorization header for the original request
      originalRequest.headers['Authorization'] = `Bearer ${token}`;
      
      // Process any queued requests
      processQueue(null, token);
      
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      
      // Clear auth state on refresh failure
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      removeAuthToken();
      
      // Redirect to login
      window.location.href = '/login';
      
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

// Add request interceptor for debugging
api.interceptors.request.use(
  config => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`%c API Request: ${config.method.toUpperCase()} ${config.url} %c`, 
        'background: #34d399; color: black; padding: 2px 4px; border-radius: 3px;', 
        '', 
        config.data || '');
      
      // Log if Authorization header is present
      const hasAuth = !!config.headers.Authorization;
      console.log(`Request has Authorization header: ${hasAuth ? '✅' : '❌'}`);
    }
    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  response => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`%c API Response: ${response.config.method.toUpperCase()} ${response.config.url} %c`, 
        'background: #8b5cf6; color: white; padding: 2px 4px; border-radius: 3px;', 
        '', 
        response.status, response.data);
    }
    return response;
  },
  error => {
    if (process.env.NODE_ENV === 'development') {
      console.error(`%c API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url} %c`, 
        'background: #ef4444; color: white; padding: 2px 4px; border-radius: 3px;', 
        '', 
        error.response?.status, error.response?.data);
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
const auth = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => 
    api.post(`/auth/reset-password/${token}`, { password: newPassword }),
  verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
  resendVerification: () => api.post('/auth/resend-verification'),
  changePassword: (currentPassword, newPassword) => api.post('/auth/change-password', { currentPassword, newPassword }),
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
  addToWishlist: (productId) => api.post('/users/wishlist', { productId }),
  removeFromWishlist: (productId) => api.delete(`/users/wishlist/${productId}`),

};

// Product endpoints
const product = {
  searchProducts: (params) => {
    // Clean up and validate params
    const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        // Convert numeric values
        if (['page', 'limit', 'minPrice', 'maxPrice'].includes(key)) {
          acc[key] = Number(value);
        } else {
          acc[key] = value;
        }
      }
      return acc;
    }, {});

    console.log('API Search Params:', cleanParams);
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

  sortProducts: (params) => {
    // Clean up and validate sort params
    const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        // Convert numeric values
        if (['page', 'limit', 'minPrice', 'maxPrice'].includes(key)) {
          acc[key] = Number(value);
        } else {
          acc[key] = value;
        }
      }
      return acc;
    }, {});

    console.log('API Sort Params:', cleanParams);
    return api.get('/products/sort', { params: cleanParams });
  },

  filterProductsByPriceRange: (params) => {
    // Clean up and validate filter params
    const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        // Convert numeric values
        if (['page', 'limit', 'minPrice', 'maxPrice'].includes(key)) {
          acc[key] = Number(value);
        } else {
          acc[key] = value;
        }
      }
      return acc;
    }, {});

    // Validate price range
    if (cleanParams.minPrice && cleanParams.maxPrice && cleanParams.minPrice > cleanParams.maxPrice) {
      return Promise.reject(new Error('Minimum price cannot be greater than maximum price'));
    }

    console.log('API Filter Params:', cleanParams);
    return api.get('/products/filter/price', { params: cleanParams });
  },
  
  // Product Detail Routes
  getProductById: (id) => api.get(`/products/${id}`),
  getRelatedProducts: (id) => api.get(`/products/${id}/related`),
  getProductReviews: (id) => api.get(`/products/${id}/reviews`),
  addProductReview: (id, reviewData) => api.post(`/products/${id}/reviews`, reviewData),
  rateProduct: (productId, ratingData) => 
    api.post(`/products/${productId}/rate`, ratingData),
  getProductRatings: (productId) => 
    api.get(`/products/${productId}/ratings`),
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
  cancelOrder: (id) => api.put(`/orders/${id}/cancel`),
  getOrderTracking: (id) => api.get(`/orders/${id}/tracking`),
  processPayment: (orderId) => api.post(`/orders/${orderId}/payment`),
  verifyOrderPayment: (orderId) => api.post(`/orders/${orderId}/verify-payment`),
  getOrderPaymentStatus: (orderId) => api.get(`/orders/${orderId}/payment-status`)
};

// Payment endpoints
const payment = {
  createTestCheckout: () => api.post('/payments/test-checkout'),
  verifyCheckoutSession: (sessionId, orderId) => api.post('/payments/verify-checkout-session', { 
    sessionId, 
    orderId 
  }),
  createCheckoutSession: (orderId) => api.post('/payments/create-checkout-session', { orderId }),
  processAlternativePayment: (orderId, method) => api.post('/payments/process', { 
    orderId, 
    paymentMethod: method 
  }),
  createPaymentIntent: (orderId) => api.post('/payments/create-intent', { orderId }),
  verifyPayment: (paymentIntentId) => api.post('/payments/verify', { paymentIntentId }),
  updatePaymentIntent: (paymentIntentId, method) => api.post('/payments/update-intent', { 
    paymentIntentId, 
    method 
  }),
  getPaymentStatus: () => api.get('/payments/status/:paymentId')
};

// Coupon endpoints
const coupon = {
  validateCoupon: (data) => api.post('/coupons/validate', data),
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

// Export everything
export { 
  api, 
  setAuthToken, 
  removeAuthToken, 
  initializeAuth,
  auth, 
  user, 
  product, 
  cart, 
  order, 
  payment,
  coupon, 
  contact, 
  subscription 
};