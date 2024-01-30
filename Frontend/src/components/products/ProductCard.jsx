import { useEffect, useState } from "react";
import { FaRegStar, FaStarHalfAlt, FaStar } from "react-icons/fa";
import axios from "../../api/axios";
const GETPRODUCT_URL = "/api/products";

export const ProductCard = () => {
  const [products, setProducts] = useState([]);

  // get Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(GETPRODUCT_URL);
        setProducts(response.data);
      } catch (err) {
        if (err.response) {
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.headers);
        } else {
          console.log(`Error: ${err.message}`);
        }
      }
    };
    fetchProducts();
  }, []);

  console.log(products);

  return (
    <section className="flex flex-wrap justify-center">
      <div className="max-w-2xl mx-auto ">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white  shadow-md rounded-lg max-w-sm dark:bg-gray-800 dark:border-gray-700"
          >
            <a href="#">
              <img
                className="rounded-t-lg p-8"
                src={product.image}
                alt="product image"
              />
            </a>
            <div className="px-5 pb-5">
              <a href="#">
                <h3 className="text-gray-900 font-semibold text-xl tracking-tight dark:text-white">
                  {product.name}
                </h3>
              </a>
              <div className="flex items-center mt-2.5 mb-5">
                <span className="ml-1">
                  <FaStar className="w-5 h-5 text-yellow-300" />
                </span>
                <span className="ml-1">
                  <FaStar className="w-5 h-5 text-yellow-300" />
                </span>
                <span className="ml-1">
                  <FaStar className="w-5 h-5 text-yellow-300" />
                </span>

                <span className="ml-1">
                  <FaStarHalfAlt className="w-5 h-5 text-yellow-300" />
                </span>
                <span className="ml-1">
                  <FaRegStar className="w-5 h-5 text-yellow-300" />
                </span>

                <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-3">
                  5.0
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {product.price}
                </span>
                <a
                  href="#"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Add to cart
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
