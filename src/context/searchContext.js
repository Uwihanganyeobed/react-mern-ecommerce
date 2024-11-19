import React, { createContext, useState, useContext } from "react";
import axios from "axios";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchProducts = async (searchTerm) => {
    if (!searchTerm) return setSearchResults([]);
    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://react-mern-back-end.onrender.com/products/search?name=${searchTerm}`
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SearchContext.Provider value={{ searchResults, searchProducts, isLoading }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
