import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { ProductCard } from "../../components/products/ProductCard";
import { SingleImage } from "./SingleImage";

const GETPRODUCT_URL = "/api/products";
export const CategoriesStore = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  // get Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/categories");
        console.log(response.data);
        setCategories(response.data);
      } catch (err) {
        if (err.response) {
          console.log(err?.response.data);
        } else {
          console.log(`Error: ${err.message}`);
        }
      }
    };
    fetchCategories();
  }, []);
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
    <>
      <section className="bg-white py-20 dark:bg-dark lg:py-[120px]">
        <div className="container mx-auto">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full px-4">
              <div className="flex flex-wrap items-center justify-center">
                {categories.length > 0 &&
                  categories.map((category) => (
                    <SingleImage
                      key={category.id}
                      to={category.id}
                      Alt={category.name}
                      imgSrc={category.icon}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="w-fit mx-auto justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5">
        <h3 className="mb-10 text-2xl font-bold">All Products</h3>
        <section className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5">
          {products
            .slice()
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
    </>
  );
};
