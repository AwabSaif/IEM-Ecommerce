import { createContext, useContext, useEffect, useState } from "react";
import axios from "../api/axios";

const SearchContext = createContext();
const GETPRODUCT_URL = "/api/products";
export const SearchProvider = ({ children }) => {
  const [query, setQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [getproducts, setGetProducts] = useState([]);

  // get Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(GETPRODUCT_URL);
        // console.log(response.data);
        setGetProducts(response.data);
      } catch (err) {
        if (err.response) {
          console.log(err?.response.data);
        } else {
          console.log(`Error: ${err.message}`);
        }
      }
    };
    fetchProducts();
  }, []);

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);


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

    setFilteredProducts(filteredProducts);
  };

  return (
    <SearchContext.Provider
      value={{ query, setGetProducts, handleSearch, filteredProducts }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  return useContext(SearchContext);
};
