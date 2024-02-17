import { useEffect, useState } from "react";
import { ProductCard } from "../../components/products/ProductCard";
import axios from "../../api/axios";
import { Link } from "react-router-dom";
import logo from "../../assets/image/IEM Ecommerce-logo.png";

const GETPRODUCT_URL = "/api/products";
const GET_BEST_SELLERS_URL = "/api/products/get/best-sellers";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  // Function to fetch products when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(GETPRODUCT_URL);
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

  // Function to fetch best sellers when the component mounts
  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const response = await axios.get(GET_BEST_SELLERS_URL);
        setBestSellers(response.data);
      } catch (err) {
        if (err.response) {
          console.log(err?.response.data);
        } else {
          console.log(`Error: ${err.message}`);
        }
      }
    };
    fetchBestSellers();
  }, []);

  // JSX for rendering the component
  return (
    <>
      <section className="px-3 py-5 lg:py-10">
        {/* Promotional section */}
        <div className="w-fit mx-auto  grid lg:grid-cols-2 items-center  rounded-md shadow shadow-fuchsia-400 mt- p-2 justify-items-center gap-5">
          {/* Promotional content */}
          <div className="order-2 lg:order-1 flex flex-col justify-center items-center">
            {/* Promotion text */}
            <p className="text-4xl font-bold md:text-7xl text-fuchsia-500">
              25% OFF
            </p>
            {/* Product description */}
            <p className="text-4xl font-bold md:text-5xl">
              Vichy Dercos Shampoo oil control clean and refreshed hair
            </p>
            {/* Promotion details */}
            <p className="mt-2 text-sm md:text-lg">For limited time only!</p>
            {/* Shop Now button */}
            <Link
              to={`/product/65cbe8aedefb7025eece4727`}
              className="text-lg md:text-2xl rounded-md bg-fuchsia-500 text-white py-2 px-5 mt-10 hover:bg-zinc-800"
            >
              Shop Now
            </Link>
          </div>
          {/* Promotional image */}
          <div className="order-1 lg:order-2">
            <img
              className="h-80 w-80 object-cover lg:w-[500px] lg:h-[500px]"
              src="http://localhost:5000/public/uploads/petracare-Vichy-17-1707862190199.png"
            />
          </div>
        </div>
      </section>
      {/* Recently Arrived Products */}
      <div className="w-fit mx-auto justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5">
        <h3 className="mb-10 text-2xl font-bold">Recently arrived</h3>
        <section className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5">
          {/* Mapping through products to display product cards */}
          {products
            .slice(-8)
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
      </div>
      <section className="px-3  py-5 lg:py-10">
        <div className="w-fit  mx-auto  grid lg:grid-cols-2 items-center  rounded-md shadow shadow-fuchsia-400 mt- p-2 justify-items-center gap-5">
          <div className="order-2 lg:order-1 flex flex-col justify-center items-center">
            <p className="text-4xl text-center font-bold md:text-5xl">
              Explore what you can buy with IEM ECOMMERCE
            </p>
            {/* Explore button */}
            <Link
              to={`/store`}
              className="text-lg md:text-2xl rounded-md bg-fuchsia-500 text-white py-2 px-5 mt-10 hover:bg-zinc-800"
            >
              Explore Now
            </Link>
          </div>
          <div className="order-1 lg:order-2">
            {/* Logo */}
            <img
              className="h-80 w-80 object-cover lg:w-[500px] lg:h-[500px]"
              src={logo}
            />
          </div>
        </div>
      </section>
      {/* Best Seller Products */}
      <div className="w-fit mx-auto justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5">
        <h3 className="mb-10 text-2xl font-bold">Best seller</h3>
        <section className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5">
          {/* Mapping through best sellers to display product cards */}
          {bestSellers.map((product) => (
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
}
