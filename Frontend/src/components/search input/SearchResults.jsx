import { useEffect, useState } from "react";

import { ProductCard } from "../products/ProductCard";
import { useSearch } from "../../context/SearchContext";
import axios from "../../api/axios";
import { FaExclamationCircle } from "react-icons/fa";

const GETPRODUCT_URL = "/api/products";
export const SearchResults = () => {
  const { query, filteredProducts } = useSearch();

  return (
    <div className="w-fit mx-auto justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5">
      <h3 className="mb-10 text-md font-bold">
        Search results for "<span className="text-sm font-medium">{query}</span>
        "
      </h3>
      <section className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
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
          ))
        ) : (
        
            <div className=" text-fuchsia-500 text-sm font-bold ">
              <span className="flex gap-2justify-center w-full text-lg font-semibold">
                <FaExclamationCircle className=" text-fuchsia-500 text-3xl" />{" "}
                There are no results for your search, try another search term.
              </span>
            </div>
      
        )}
      </section>
    </div>
  );
};
