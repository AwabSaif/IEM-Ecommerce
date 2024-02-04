import React from "react";
import { Product } from "../../components/products/Product";

export const Store = () => {
  return (
    <div className="w-fit mx-auto justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5">
      <h3 className="mb-10 text-2xl font-bold">All Products</h3>
      <section>
        <Product />
      </section>
    </div>
  );
};
