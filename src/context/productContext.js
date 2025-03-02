import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { product as productApi } from '../services/api';
import { toast } from 'react-toastify';

const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [topRatedProducts, setTopRatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  // Basic Product Operations
  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      const response = await productApi.getPaginatedProducts(page);
      console.log('All Products (Paginated):', response.data);
      setProducts(response.data);
      setCurrentPage(page);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Error loading products');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Featured Products
  const fetchFeaturedProducts = async () => {
    try {
      const response = await productApi.getFeaturedProducts();
      console.log('Featured Products:', response.data);
      setFeaturedProducts(response.data);
      return response.data;
    } catch (error) {
      console.error('Featured Products Error:', error);
      return [];
    }
  };

  // New Products
  const fetchNewProducts = async () => {
    try {
      const response = await productApi.getNewProducts();
      console.log('New Products:', response.data);
      setNewProducts(response.data);
      return response.data;
    } catch (error) {
      console.error('New Products Error:', error);
      return [];
    }
  };

  const getNewProduct = async (id) => {
    try {
      const response = await productApi.getNewProduct(id);
      console.log('Single New Product:', response.data);
      return response.data;
    } catch (error) {
      console.error('New Product Error:', error);
      toast.error('Error loading new product');
      return null;
    }
  };

  // Get products by category
  const getProductsByCategory = useCallback(async (category) => {
    try {
      setLoading(true);
      const response = await productApi.getProductsByCategory(category);
      console.log('Category Products:', response.data);
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, data: [] };
    }
  }, []);

  // Get category product details
  const getCategoryProduct = useCallback(async (id) => {
    try {
      setLoading(true);
      const response = await productApi.getCategoryProduct(id);
      console.log('Single Category Product:', response.data);
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, data: null };
    }
  }, []);

  // Fetch categories - this should be implemented to only run once
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await productApi.getCategories();
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  // Available & Top Rated Products
  const fetchAvailableProducts = async () => {
    try {
      const response = await productApi.getAvailableProducts();
      console.log('Available Products:', response.data);
      setAvailableProducts(response.data);
      return response.data;
    } catch (error) {
      console.error('Available Products Error:', error);
      return [];
    }
  };

  const fetchTopRatedProducts = async () => {
    try {
      const response = await productApi.getTopRatedProducts();
      console.log('Top Rated Products:', response.data);
      setTopRatedProducts(response.data);
      return response.data;
    } catch (error) {
      console.error('Top Rated Products Error:', error);
      return [];
    }
  };

  // Product Details & Related
  const getProductById = async (id) => {
    try {
      const response = await productApi.getProductById(id);
      console.log('Product Details:', response.data);
      return response.data;
    } catch (error) {
      console.error('Product Details Error:', error);
      toast.error('Error loading product details');
      return null;
    }
  };

  const getRelatedProducts = async (id) => {
    try {
      const response = await productApi.getRelatedProducts(id);
      console.log('Related Products:', response.data);
      return response.data;
    } catch (error) {
      console.error('Related Products Error:', error);
      return [];
    }
  };

  // Blog Products
  const getBlogProduct = async (id) => {
    try {
      const response = await productApi.getBlogProduct(id);
      console.log('Blog Product:', response.data);
      return response.data;
    } catch (error) {
      console.error('Blog Product Error:', error);
      return null;
    }
  };

  // Search & Filter Operations
  const searchProducts = async (query) => {
    try {
      setLoading(true);
      const response = await productApi.searchProducts(query);
      console.log('Search Results:', response.data);
      return response.data;
    } catch (error) {
      console.error('Search Error:', error);
      toast.error('Error searching products');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const sortProducts = async (sortParams) => {
    try {
      const response = await productApi.sortProducts(sortParams);
      console.log('Sorted Products:', response.data);
      return response.data;
    } catch (error) {
      console.error('Sort Error:', error);
      return [];
    }
  };

  const filterByPriceRange = async (minPrice, maxPrice) => {
    try {
      const response = await productApi.filterProductsByPriceRange(minPrice, maxPrice);
      console.log('Price Filtered Products:', response.data);
      return response.data;
    } catch (error) {
      console.error('Price Filter Error:', error);
      return [];
    }
  };

  // Reviews
  const getProductReviews = async (id) => {
    try {
      const response = await productApi.getProductReviews(id);
      console.log('Product Reviews:', response.data);
      return response.data;
    } catch (error) {
      console.error('Reviews Error:', error);
      return [];
    }
  };

  const addProductReview = async (id, reviewData) => {
    try {
      const response = await productApi.addProductReview(id, reviewData);
      console.log('Review Added:', response.data);
      toast.success('Review added successfully');
      return response.data;
    } catch (error) {
      console.error('Add Review Error:', error);
      toast.error(error.response?.data?.message || 'Error adding review');
      throw error;
    }
  };

  const fetchFilteredProducts = async (filters) => {
    try {
      setLoading(true);
      const response = await productApi.searchProducts(filters);
      console.log('Filtered Products:', response.data);
      setProducts(response.data);
      return response.data;
    } catch (error) {
      console.error('Filter Products Error:', error);
      toast.error('Error filtering products');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      console.log('Initializing Product Data...');
      await Promise.all([
        fetchProducts(1),
        fetchFeaturedProducts(),
        fetchNewProducts(),
        fetchAvailableProducts(),
        fetchTopRatedProducts(),
        fetchCategories(),
        // getProductReviews(1) // Fetch reviews for the first product to populate initial state
      ]);
      console.log('Product Data Initialization Complete');
    };

    initializeData();
  }, []);

  const value = {
    // State
    products,
    featuredProducts,
    newProducts,
    availableProducts,
    topRatedProducts,
    categories,
    loading,
    currentPage,
    totalPages,
    // Methods
    fetchProducts,
    fetchFeaturedProducts,
    fetchFilteredProducts,
    fetchNewProducts,
    getNewProduct,
    fetchCategories,
    getProductsByCategory,
    getCategoryProduct,
    fetchAvailableProducts,
    fetchTopRatedProducts,
    getProductById,
    getRelatedProducts,
    getBlogProduct,
    searchProducts,
    sortProducts,
    filterByPriceRange,
    getProductReviews,
    addProductReview
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};