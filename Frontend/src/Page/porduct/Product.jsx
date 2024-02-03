import { useEffect, useState } from "react";
import axios from "../../api/axios";

import { ProductCard } from "../../components/products/ProductCard";
const GETPRODUCT_URL = "/api/products";
export const Product = () => {
  const [products, setProducts] = useState([]);
  // get Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(GETPRODUCT_URL);
        // console.log(response.data);
        setProducts(response.data);
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

  return (
    <section
   
      className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5"
    >
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
