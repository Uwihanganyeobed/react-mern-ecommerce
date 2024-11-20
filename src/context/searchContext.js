import React, { createContext, useState, useContext } from "react";
import axios from "axios";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState(""); // Store the search term globally
  const [searchResults, setSearchResults] = useState([]); // Store search results globally
  const [isLoading, setIsLoading] = useState(false); // For loading state

  // Fetch search results based on the search term
  const searchProducts = async (term) => {
    setSearchTerm(term); // Update the global search term
    if (!term) return setSearchResults([]); // Clear results for an empty search
    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://react-mern-back-end.onrender.com/products/search?name=${term}`
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset the search state
  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
  };

  // Make state and functions available to other components
  return (
    <SearchContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        searchResults,
        searchProducts,
        clearSearch,
        isLoading,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
