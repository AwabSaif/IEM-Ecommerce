import { useEffect, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
export const AllProducts = () => {

  const [products, setProducts] = useState();
  const { auth } = useAuth();
  const token = auth.token;

  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setproductsPerPage] = useState(5);
console.log(productsPerPage);
  const handleproductsPerPageChange = (event) => {
    const selectedValue = parseInt(event.target.value, 10);
    setproductsPerPage(selectedValue);
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getProducts = async () => {
      try {
        const response = await axios.get("api/products", {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
          withCredentials: true,
          signal: controller.signal,
          params: {
            page: currentPage,
            perPage: productsPerPage,
          },
        });

        console.log(response.data);
        isMounted && setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    getProducts();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [productsPerPage]);
  const removeUser = async (id) => {
    try {
      // إرسال طلب DELETE إلى الخادم
      await axios.delete(`/api/products/${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
      });

      // إعادة تحميل قائمة المستخدمين بعد الحذف
      const updatedProducts = products.filter((product) => product.id !== id);
      setProducts(updatedProducts);

      // إعادة تحميل الصفحة الحالية
      getProducts();
    } catch (error) {
      console.error("Error removing products:", error);
    }
  };

  return (
    <article className="antialiased font-sans bg-white">
      <div className="isolate bg-white px-6 py-4 sm:py-6 lg:px-8">
        <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"></div>
        <div className="container mx-auto px-4 sm:px-8">
          <div className="py-8">
            <div>
              <h2 className="text-2xl font-semibold leading-tight">Products</h2>
            </div>
            <div className="my-2 flex sm:flex-row flex-col">
              <div className="flex flex-row mb-1 sm:mb-0">
                <div className="relative">
                  <select
                    onChange={handleproductsPerPageChange}
                    className="appearance-none h-full rounded-l  text-base border block  w-full bg-white border-gray-400 text-gray-700  px-5  leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    value={productsPerPage}
                  >
                    <option>5</option>
                    <option>10</option>
                    <option>20</option>
                  </select>

                  <span className="-mr-2 pointer-events-none absolute  inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <MdKeyboardArrowDown />
                  </span>
                </div>
                {/*
                <div className="relative">
                  <select className=" h-full rounded-r border-t sm:rounded-r-none sm:border-r-0 border-r border-b block appearance-none w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-l focus:border-r focus:bg-white focus:border-gray-500">
                    <option>All</option>
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <MdKeyboardArrowDown />
                  </div>
                </div> 
                */}
              </div>
              <div className="block relative">
                <span className="h-full absolute inset-y-0 left-0 flex items-center pl-2">
                  <IoIosSearch />
                </span>
                <input
                  placeholder="Search"
                  className="appearance-none rounded-r rounded-l sm:rounded-l-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
                />
              </div>
            </div>
            <div className="-mx-4  sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
              <div className="inline-block min-w-full  shadow rounded-lg overflow-hidden">
                <table className="min-w-full  leading-normal">
                  <thead>
                    <tr>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Product Name
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Price
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Quantity
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Product Category
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {products?.length ? (
                      products
                        .slice()
                        .reverse()
                        .map((product) => (
                          <tr key={product?.id}>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                              <div className="items-center">
                                <div className="ml-3">
                                  <p className="text-gray-900 whitespace-no-wrap">
                                    {product?.name}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                              <p className="text-gray-900 whitespace-no-wrap">
                                {product?.price}
                              </p>
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                              <p className="text-gray-900 whitespace-no-wrap">
                                {product?.countInStock}
                              </p>
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                              <p className="text-gray-900 whitespace-no-wrap">
                                 {product?.category.name} 
                              </p>
                            </td>
                            <td className="px-5  border-b border-gray-200 bg-white text-sm">
                              <div className="flex items-center justify-center lg:-ml-16">
                                <button className="p-2.5 bg-blue-500 rounded-xl hover:rounded-3xl hover:bg-blue-600 transition-all duration-300 text-white">
                                  <span className="text-lg text-center">
                                    <FaRegEdit />
                                  </span>
                                </button>
                                <button
                                  onClick={() => removeUser(product?.id)}
                                  className="ml-2 py-2.5 px-5 bg-red-500 rounded-xl hover:rounded-3xl hover:bg-red-600 transition-all duration-300 text-white"
                                >
                                  <span className="text-lg text-center">
                                    <RiDeleteBin6Line />
                                  </span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td colSpan="5">
                          <p className="text-xs xs:text-sm text-gray-900">
                            No products to display
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <div className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between          ">
                  <br />

                  <span className="text-xs xs:text-sm text-gray-900">
                    Showing 1 to {products ? products.length : 0} of{" "}
                    {products ? products.length : 0} Entries
                  </span>

                  <div className="inline-flex mt-2 xs:mt-0">
                    <button
                      onClick={() =>
                        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
                      }
                      className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l"
                    >
                      Prev
                    </button>

                    <button
                      onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
                      className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-r"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
