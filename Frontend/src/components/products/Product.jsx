import { useEffect, useState } from "react";
import axios from "../../api/axios";

import { ProductCard } from "./ProductCard";

const GETPRODUCT_URL = "/api/products";
export const Product = () => {
  const [products, setProducts] = useState([]);

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(GETPRODUCT_URL  );
        // Set the fetched products to the state
        setProducts(response.data);
      } catch (err) {
        if (err.response) {
          // Log the error response if available
          console.log(err?.response.data);
        } else {
          // Log the error message if no response is available
          console.log(`Error: ${err.message}`);
        }
      }
    };
    fetchProducts();
  }, []);

  return (
    <section className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5">
      {/* Map through the products array and render ProductCard component for each product */}
      {products
        .slice(0)
        .reverse()
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
  );
};
