import { Link } from "react-router-dom";
import { BsCartPlus } from "react-icons/bs";
import { FaStar } from "react-icons/fa6";
import { FaStarHalfAlt } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import useCart from "../../hooks/useCart";

export const ProductCard = ({
  productId,
  productImage,
  productName,
  productRating,
  productPrice,
  productBrand,
  productCountInStock,
}) => {
  const { getItemsQuantity, increaseCartQuantity, decreaseCartQuantity } =
    useCart();
  const id = productId;
  const quantity = getItemsQuantity(id);
  return (
    <div className="w-72 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl">
      <Link to={`/product/${id}`}>
        <img
          src={productImage}
          alt={productImage}
          className="h-80 w-72 object-cover rounded-t-xl"
        />
      </Link>
      <div className="px-4 py-3 w-72">
        <Link to={`/product/${id}`}>
          <span className="text-gray-400 mr-3 uppercase text-xs">
            {productBrand}
          </span>
          <p className="text-md font-bold text-gray-900 truncate block capitalize">
            {productName}
          </p>
          <div className="mt-1 flex flex-row justify-start items-center">
            {[...Array(Math.floor(productRating))].map((_, index) => (
              <span
                key={index}
                className="block p-1 transition ease-in duration-300"
              >
                <FaStar className="w-5 h-5 text-yellow-300" />
              </span>
            ))}
            {productRating % 1 !== 0 && (
              <span className="block p-1 transition ease-in duration-300">
                <FaStarHalfAlt className="w-5 h-5 text-yellow-300" />
              </span>
            )}
            <span className="bg-fuchsia-100 text-fuchsia-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded ">
              {productRating}
            </span>
          </div>
        </Link>
        <div className="flex items-center">
          <p className="text-lg font-semibold text-gray-900 cursor-auto my-3">
            ${productPrice}
          </p>
          <del>
            {/* <p className="text-sm text-gray-600 cursor-auto ml-2">$199</p> */}
          </del>
          <div className="ml-auto">
            {quantity === 0 && productCountInStock > 0 ? (
              <button
                onClick={() => increaseCartQuantity(id, productCountInStock)}
              >
                <BsCartPlus className="text-3xl text-fuchsia-500 transition ease-in duration-300 hover:text-fuchsia-600/60  focus:outline-none" />
              </button>
            ) : quantity > 0 ? (
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center border-gray-100">
                  <button
                    onClick={() => decreaseCartQuantity(id)}
                    className="cursor-pointer rounded-l bg-fuchsia-100 py-1 px-3.5 duration-100 hover:bg-fuchsia-500 hover:text-fuchsia-50"
                  >
                    -
                  </button>

                  <span className="h-8 w-8 border flex justify-center items-center bg-white text-xs outline-none">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      increaseCartQuantity(id, productCountInStock)
                    }
                    className="cursor-pointer rounded-r bg-fuchsia-100 py-1 px-3 duration-100 hover:bg-fuchsia-500 hover:text-fuchsia-50"
                    disabled={quantity >= productCountInStock}
                  >
                    +
                  </button>
                </div>
              </div>
            ) : (
              <span className="text-red-500 font-bold">Out of Stock</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
