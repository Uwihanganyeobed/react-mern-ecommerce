import React, { createContext, useState, useContext, useCallback } from "react";
import { product as productApi } from '../services/api';
import { toast } from 'react-toastify';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });

  const searchProducts = useCallback(async (params) => {
    try {
      setLoading(true);
      
      // Clean and validate parameters
      const searchParams = {
        q: params.q?.trim() || '',
        category: params.category?.trim() || '',
        minPrice: params.minPrice ? Number(params.minPrice) : '',
        maxPrice: params.maxPrice ? Number(params.maxPrice) : '',
        sortBy: params.sortBy || 'newest',
        inStock: Boolean(params.inStock),
        onSale: Boolean(params.onSale),
        page: Number(params.page) || 1,
        limit: Number(params.limit) || 10
      };

      // Remove empty parameters
      Object.keys(searchParams).forEach(key => {
        if (searchParams[key] === '' || searchParams[key] === null || searchParams[key] === undefined) {
          delete searchParams[key];
        }
      });

      console.log('Search params:', searchParams); // Debug log

      const response = await productApi.searchProducts(searchParams);
      
      if (!response.data) {
        throw new Error('No data received from server');
      }

      // Handle different response structures
      const products = Array.isArray(response.data) 
        ? response.data 
        : response.data.products || [];

      const paginationData = response.data.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalItems: products.length
      };

      setSearchResults(products);
      setPagination(paginationData);
      
      return products;
    } catch (error) {
      console.error('Search Error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error searching products';
      toast.error(errorMessage);
      setSearchResults([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const filterProducts = useCallback(async (filters) => {
    try {
      setLoading(true);
      
      // Clean and validate filter parameters
      const params = {
        q: filters.q?.trim() || filters.query?.trim() || '',
        category: filters.category?.trim() || '',
        minPrice: filters.minPrice ? Number(filters.minPrice) : '',
        maxPrice: filters.maxPrice ? Number(filters.maxPrice) : '',
        sortBy: filters.sortBy || 'newest',
        inStock: Boolean(filters.inStock),
        onSale: Boolean(filters.onSale),
        brand: filters.brand?.trim() || '',
        page: Number(filters.page) || 1,
        limit: Number(filters.limit) || 10
      };

      // Remove empty parameters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      console.log('Filter params:', params); // Debug log

      const response = await productApi.searchProducts(params);
      
      if (!response.data) {
        throw new Error('No data received from server');
      }

      // Handle different response structures
      const products = Array.isArray(response.data) 
        ? response.data 
        : response.data.products || [];

      const paginationData = response.data.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalItems: products.length
      };

      setSearchResults(products);
      setPagination(paginationData);
      
      return products;
    } catch (error) {
      console.error('Filter Error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error filtering products';
      toast.error(errorMessage);
      setSearchResults([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <SearchContext.Provider value={{
      searchResults,
      loading,
      pagination,
      searchProducts,
      filterProducts
    }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
