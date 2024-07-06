// Importing necessary dependencies from React library
import { createContext, useContext, useEffect, useState } from "react";

// Importing Axios instance from custom API file
import axios from "../api/axios";

// Creating a context for search-related data
const SearchContext = createContext();

// API endpoint for getting products
const GETPRODUCT_URL = "/api/products";

// SearchProvider component to manage search-related state and functions
export const SearchProvider = ({ children }) => {
  // State variables for query, filtered products, and fetched products
  const [query, setQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [getproducts, setGetProducts] = useState([]);

  // useEffect hook to fetch products when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(GETPRODUCT_URL  );
        setGetProducts(response.data);
      } catch (err) {
        // Handling errors
        if (err.response) {
          console.log(err?.response.data);
        } else {
          console.log(`Error: ${err.message}`);
        }
      }
    };
    fetchProducts();
  }, []);

  // Function to handle search query
  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);

    // Filtering products based on search query
    const filteredProducts = getproducts.filter((product) => {
      const { name, sku ,brand ,description ,richDescription ,category } = product;
      const searchValue = searchQuery.toLowerCase();
      return (
        name.toLowerCase().includes(searchValue) ||
        brand.toLowerCase().includes(searchValue) ||
        category.name.toLowerCase().includes(searchValue) ||
        description.toLowerCase().includes(searchValue) ||
        richDescription.toLowerCase().includes(searchValue) ||
        sku.toLowerCase().includes(searchValue)
      );
    });

    // Setting filtered products state
    setFilteredProducts(filteredProducts);
  };

  // Providing search-related context to children components
  return (
    <SearchContext.Provider
      value={{ query, setGetProducts, handleSearch, filteredProducts }}
    >
      {children}
    </SearchContext.Provider>
  );
};

// Custom hook to access search-related context
export const useSearch = () => {
  return useContext(SearchContext);
};
