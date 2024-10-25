import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { ProductCard } from "../../components/products/ProductCard";
import { NavCategories } from "./NavCategories";

// API endpoints
const GET_PRODUCT_URL = "/api/products";
const GET_CATEGORIES_URL = "/api/categories";

export const CategoriesStore = () => {
  // State variables
  const [selectedCategory, setSelectedCategory] = useState(null); // State for selected category
  const [categories, setCategories] = useState([]); // State for categories
  const [products, setProducts] = useState([]); // State for products

  // Effect hook to fetch categories from the server
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(GET_CATEGORIES_URL, { withCredentials: true }); // Fetch categories from the server
        setCategories(response.data); // Set categories in state
      } catch (err) {
        // Handle errors
        if (err.response) {
          console.log(err?.response.data); // Log error response data
        } else {
          console.log(`Error: ${err.message}`); // Log generic error message
        }
      }
    };
    fetchCategories(); // Invoke fetchCategories function
  }, []);

  // Effect hook to fetch products based on selected category
  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get(GET_PRODUCT_URL, { withCredentials: true }); // Fetch products from the server
        setProducts(response.data); // Set all products in state

        // Filter products based on selected category
        const filtered = response.data.filter((product) => {
          const { category } = product;
          const searchValue = selectedCategory.toLowerCase(); // Convert selected category to lowercase for case-insensitive comparison
          return category._id.toLowerCase().includes(searchValue); // Check if product category ID matches the selected category
        });
        setProducts(filtered); // Set filtered products in state
      } catch (err) {
        // Handle errors
        if (err.response) {
          console.log(err?.response.data); // Log error response data
        } else {
          console.log(`Error: ${err.message}`); // Log generic error message
        }
      }
    };
    getProducts(); // Invoke getProducts function
  }, [selectedCategory]); // Run effect when selectedCategory changes

  // Render components
  return (
    <>
      <div className="w-fit mx-auto justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5">
        <div className="flex flex-wrap items-center justify-center">
          <NavCategories
            categories={categories}
            onSelectCategory={setSelectedCategory} // Pass setSelectedCategory function as prop
          />
        </div>
        <section className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5">
          {/* Map through products and render ProductCard component for each product */}
          {products
            .slice()
            .reverse() // Reverse the order of products
            .map((product) => (
              <ProductCard
                key={product._id}
                productId={product._id}
                productImage={product.image}
                productName={product.name}
                productRating={product.rating}
                productPrice={product.price}
                productBrand={product.brand}
                productCountInStock={product.countInStock}
              />
            ))}
        </section>
      </div>
    </>
  );
};
