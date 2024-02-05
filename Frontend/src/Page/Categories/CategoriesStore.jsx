import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { ProductCard } from "../../components/products/ProductCard";
import { NavCategories } from "./NavCategories";

const GETPRODUCT_URL = "/api/products";
export const CategoriesStore = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  // get Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/categories");

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
    const getProducts = async () => {
      try {
        const response = await axios.get(GETPRODUCT_URL, {
          withCredentials: true,
        });
        setProducts(response.data);
        const filtered = response.data.filter((product) => {
          const { category } = product;
          const searchValue = selectedCategory.toLowerCase();
          return category._id.toLowerCase().includes(searchValue);
        });
        setProducts(filtered);
      } catch (err) {
        if (err.response) {
          console.log(err?.response.data);
        } else {
          console.log(`Error: ${err.message}`);
        }
      }
    };
    getProducts();
  }, [selectedCategory]);

  return (
    <>
      <div className="w-fit mx-auto justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5">
        <div className="flex flex-wrap items-center justify-center">
          <NavCategories
            categories={categories}
            onSelectCategory={setSelectedCategory}
          />
        </div>
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
