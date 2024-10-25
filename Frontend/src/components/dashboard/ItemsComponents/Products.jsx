import React, { useEffect, useState } from "react";
import moment from "moment";
import { LuArchive } from "react-icons/lu";

export const Products = ({ products }) => {
  // State variables to store total products and products added this month
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentMonthProducts, setCurrentMonthProducts] = useState(0);

  useEffect(() => {
    // Update total products count when products prop changes
    setTotalProducts(products.length);

    // Calculate start and end dates for the current month
    const currentMonthStart = moment().startOf("month").format("YYYY-MM-DD");
    const currentMonthEnd = moment().endOf("month").format("YYYY-MM-DD");

    // Count products added within the current month
    const totalCurrentMonthProducts = products.reduce((acc, product) => {
      const productDate = moment(product.dateAdded).format("YYYY-MM-DD");

      if (productDate >= currentMonthStart && productDate <= currentMonthEnd) {
        return acc + 1;
      }
      return acc;
    }, 0);

    // Update current month products count
    setCurrentMonthProducts(totalCurrentMonthProducts);
  }, [products]);

  return (
    <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
      {/* Icon for total products */}
      <div className="bg-clip-border text-2xl mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-green-600 to-green-400 text-white shadow-green-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
        <LuArchive />
      </div>
      {/* Display total products */}
      <div className="p-4 text-right">
        <p className="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600">
          Total Products
        </p>
        <h4 className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">
          {totalProducts}
        </h4>
      </div>
      {/* Display products added this month */}
      <div className=" flex items-center border-t border-blue-gray-50 p-4">
        <h4 className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">
          {currentMonthProducts}
        </h4>
        <p className="ml-2 mt-1 block antialiased font-sans text-base leading-relaxed font-normal text-blue-gray-600">
          Products added this month
        </p>
      </div>
    </div>
  );
};
