import React, { createContext, useState, useContext, useCallback } from "react";
import { product as productApi } from '../services/api';
import { toast } from 'react-toastify';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    sort: ''
  });

  const searchProducts = useCallback(async (query) => {
    try {
      setLoading(true);
      const response = await productApi.searchProducts(query);
      console.log('Search Results:', response.data);
      
      // Check if the response has the expected structure
      const results = response.data?.data || response.data || [];
      setSearchResults(results);
      return results;
    } catch (error) {
      console.error('Search Error:', error);
      toast.error('Error searching products');
      setSearchResults([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const filterProducts = useCallback(async (filterParams) => {
    try {
      setLoading(true);
      let results;
      
      if (filterParams.minPrice || filterParams.maxPrice) {
        results = await productApi.filterProductsByPriceRange(
          filterParams.minPrice,
          filterParams.maxPrice
        );
      }
      
      if (filterParams.sort) {
        results = await productApi.sortProducts(filterParams.sort);
      }

      if (filterParams.category) {
        results = await productApi.getProductsByCategory(filterParams.category);
      }

      const finalResults = results?.data?.data || results?.data || [];
      setSearchResults(finalResults);
      setFilters(filterParams);
      return finalResults;
    } catch (error) {
      console.error('Filter Error:', error);
      toast.error('Error filtering products');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    searchResults,
    loading,
    filters,
    searchProducts,
    filterProducts
  };

  return (
    <SearchContext.Provider value={value}>
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
