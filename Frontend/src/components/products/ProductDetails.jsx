import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "../../api/axios";
import { BsArrowLeftCircleFill, BsCartPlus } from "react-icons/bs";
import { FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import useCart from "../../hooks/useCart";

import { Rating } from "./Rating";

const GETPRODUCT_URL = "/api/products/";
export const ProductDetails = () => {
  // Go back
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };

  // Get product id from params
  const { id } = useParams();

  // Get product details
  const [product, setProduct] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(GETPRODUCT_URL + id);
        setProduct(response.data);
      } catch (err) {
        if (err?.response) {
          console.log(err.response.data);
        } else {
          console.log(`Error: ${err.message}`);
        }
      }
    };
    fetchProducts();
  }, [id]); // Dependency array should include 'id' instead of 'product.id'

  // Image view
  const [currentImage, setCurrentImage] = useState(product.image);

  const handleThumbnailClick = (image) => {
    setCurrentImage(image);
  };

  // Navigate description tabs
  const [activeTab, setActiveTab] = useState("description");
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Add to cart functionality
  const { getItemsQuantity, increaseCartQuantity, decreaseCartQuantity } = useCart();
  const quantity = getItemsQuantity(id);

  return (
    <section className="py-12 sm:py-16">
      <div className="relative">
        <button
          className={`absolute cursor-pointer -mt-6 white mr-10 -right-1 rounded-full  `}
          onClick={handleGoBack}
        >
          <span className="text-fuchsia-400 text-2xl">
            <BsArrowLeftCircleFill className="rotate-180" />
          </span>
        </button>
      </div>
      <div className="container mx-auto px-4">
        <div className="lg:col-gap-12 xl:col-gap-16 mt-8 grid grid-cols-1 gap-12 lg:mt-12 lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-3 lg:row-end-1">
            <div className="lg:flex lg:items-start">
              <div className="lg:order-2 lg:ml-5">
                <div className="max-w-xl overflow-hidden rounded-lg">
                  <img
                    className="h-full w-full max-w-full object-cover"
                    src={currentImage || product.image}
                    alt={currentImage || product.image}
                  />
                </div>
              </div>

              <div className="mt-2 w-full lg:order-1 lg:w-32 lg:flex-shrink-0">
                <div className="flex flex-row items-start lg:flex-col">
                  <button
                    type="button"
                    onClick={() => handleThumbnailClick(product.image)}
                    className="flex-0 aspect-square mb-3 h-20 overflow-hidden rounded-lg border-2 border-fuchsia-500 text-center"
                  >
                    <img
                      className="h-full w-full object-cover"
                      src={product.image}
                      alt={product.image}
                    />
                  </button>

                  {product.images &&
                    product.images.map((image, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleThumbnailClick(image)}
                        className="flex-0 aspect-square mb-3 h-20 overflow-hidden rounded-lg border-2 border-fuchsia-500  text-center"
                      >
                        <img
                          className="h-full w-full object-cover"
                          src={image}
                          alt={`Product Image ${index + 1}`}
                        />
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 lg:row-span-2 lg:row-end-2">
            <h1 className="sm: text-2xl font-bold text-gray-900 sm:text-3xl">
              {product.name}
            </h1>

            <div className="mt-5 flex items-center">
              <div className="flex items-center">
                <div className="mt-1 flex flex-row justify-start items-center">
                  {/* Display star ratings */}
                  {product.rating ? (
                    [...Array(Math.floor(product.rating))].map((_, index) => (
                      <span
                        key={index}
                        className="block p-1 transition ease-in duration-300"
                      >
                        <FaStar className="w-5 h-5 text-yellow-300" />
                      </span>
                    ))
                  ) : (
                    <FaRegStar className="w-5 h-5 text-yellow-300" />
                  )}
                  {product.rating % 1 !== 0 && (
                    <span className="block p-1 transition ease-in duration-300">
                      <FaStarHalfAlt className="w-5 h-5 text-yellow-300" />
                    </span>
                  )}
                  <span className="ml-2 bg-fuchsia-100 text-fuchsia-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded ">
                    {product.rating}
                  </span>
                </div>
              </div>
              <p className="ml-2 text-sm font-medium text-gray-500">
                {product.numReviews} Reviews
              </p>
            </div>

            <div className="mt-5 space-y-2">
              {/* Display rich description */}
              <p className="flex items-center text-left text-sm font-medium text-gray-600">
                {product.richDescription}
              </p>
            </div>

            <div className="mt-5 flex items-center justify-between space-y-4  py-4 sm:space-y-0">
              <div className="flex items-end">
                <p className="text-md font-bold">Brand</p>
              </div>
              <div className="flex items-end">
                <p className="text-md ">{product.brand}</p>
              </div>
            </div>

            <div className="flex items-center justify-between space-y-4 border-t border-b py-4 sm:space-y-0">
              <div className="flex items-end">
                <h1 className="text-3xl font-bold">${product.price}</h1>
              </div>

              {/* Render add to cart button or out of stock */}
              {quantity === 0 ? (
                product.countInStock > 0 ? (
                  <button
                    type="button"
                    onClick={() => increaseCartQuantity(id)}
                    className="inline-flex items-center justify-center rounded-md border-2 border-transparent bg-fuchsia-500 bg-none px-12 py-2 text-center text-base font-bold text-fuchsia-50 transition-all duration-200 ease-in-out focus:shadow hover:bg-fuchsia-600/80"
                  >
                    <BsCartPlus className="shrink-0 mr-3 h-5 w-5" />
                    Add to cart
                  </button>
                ) : (
                  <span className="text-red-500 font-bold">Out of Stock</span>
                )
              ) : (
                <div className="mr-6 flex flex-col items-center justify-center">
                  <div className="flex items-center border-gray-100">
                    <button
                      onClick={() => decreaseCartQuantity(id)}
                      className="cursor-pointer rounded-l bg-fuchsia-100 py-2 px-5 duration-100 hover:bg-fuchsia-500 hover:text-fuchsia-50"
                    >
                      -
                    </button>

                    <span className="h-10 w-16 border flex  justify-center items-center bg-white text-xs outline-none">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        increaseCartQuantity(id, product.countInStock)
                      }
                      className="cursor-pointer rounded-r bg-fuchsia-100  py-2 px-5  duration-100 hover:bg-fuchsia-500 hover:text-fuchsia-50"
                      disabled={quantity >= product.countInStock}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 space-y-2">
              {/* Display SKU and categories */}
              <p className="flex items-center text-left text-sm font-medium text-gray-600">
                SKU: {product.sku}
              </p>
              <p className="flex items-center text-left text-sm font-medium text-gray-600">
                Categories: {product.category && product.category.name}
              </p>
            </div>
          </div>

          {/* Product description */}
          <div className="lg:col-span-3">
            <div className="border-b border-gray-300">
              <p className="flex text-xl gap-4">Description</p>
            </div>
            <div className="mt-2 flow-root ">
              <div id="description">
                <p>{product.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
