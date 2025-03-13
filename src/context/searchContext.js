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
      // Convert params to match backend expectations
      const searchParams = {
        q: params.q || params.query,
        category: params.category || '',
        minPrice: params.minPrice || '',
        maxPrice: params.maxPrice || '',
        sortBy: params.sortBy || 'newest',
        inStock: params.inStock || false,
        onSale: params.onSale || false,
        page: params.page || 1,
        limit: params.limit || 10
      };

      const response = await productApi.searchProducts(searchParams);
      console.log('Search API Response:', response); // Debug log

      // Handle the response data structure
      const products = response.data?.products || response.data || [];
      setSearchResults(products);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        totalItems: response.data.totalItems
      });
      
      return products;
    } catch (error) {
      console.error('Search Error:', error);
      toast.error('Error searching products');
      setSearchResults([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const filterProducts = useCallback(async (filters) => {
    try {
      setLoading(true);
      let response;

      // Combine search and filter parameters
      const params = {
        q: filters.query || '',
        category: filters.category || '',
        minPrice: filters.minPrice || '',
        maxPrice: filters.maxPrice || '',
        sortBy: filters.sortBy || 'newest',
        inStock: filters.inStock || false,
        onSale: filters.onSale || false,
        brand: filters.brand || '',
        page: filters.page || 1,
        limit: filters.limit || 10
      };

      response = await productApi.searchProducts(params);
      console.log('Filter API Response:', response); // Debug log

      const products = response.data?.products || response.data || [];
      setSearchResults(products);
      return products;
    } catch (error) {
      console.error('Filter Error:', error);
      toast.error('Error filtering products');
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
