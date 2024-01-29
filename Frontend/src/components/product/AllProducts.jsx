import { useEffect, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
export const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const { auth } = useAuth();
  const token = auth.token;
  //search
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (value) => {
    setSearchTerm(value);
    SetItemOffset(0);
  };

  //Paginate
  const [currentItems, SetCurrentItems] = useState(null);
  const [pageCount, SetPageCount] = useState(0);
  const [itemOffset, SetItemOffset] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const endOffset = itemOffset + itemsPerPage;
  useEffect(() => {
    SetCurrentItems(products.slice(itemOffset, endOffset).reverse());
    SetPageCount(Math.ceil(products.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, products]);

  const handlePageClick = (e) => {
    const newOffset = (e.selected * itemsPerPage) % products.length;
    SetItemOffset(newOffset);
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
        });

        const filtered = response.data.filter((filter) => {
          const { name, sku, category } = filter;
          const searchValue = searchTerm.toLowerCase();
          return (
            name.toLowerCase().includes(searchValue) ||
            sku.toLowerCase().includes(searchValue) ||
            category.toLowerCase().includes(searchValue)
          );
        });
        

        isMounted && setProducts(filtered);
      } catch (error) {
        console.error("Error fetching Products:", error);
      }
    };

    getProducts();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [searchTerm, token]);

  const removeProduct = async (id) => {
    try {
      await axios.delete(`/api/products/${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
      });
  
      const updatedProducts = products.filter((product) => product.id !== id);
      setProducts(updatedProducts);
      // تم حذف هذا السطر
      // getProducts(); // لا حاجة لاستدعاء هنا
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
                    onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
                    className="appearance-none h-full rounded-l  text-base border block  w-full bg-white border-gray-400 text-gray-700  px-5  leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    value={itemsPerPage}
                  >
                    <option>5</option>
                    <option>10</option>
                    <option>20</option>
                  </select>

                  <span className="-mr-2 pointer-events-none absolute  inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <MdKeyboardArrowDown />
                  </span>
                </div>
              </div>
              <div className="block relative">
                <span className="h-full absolute inset-y-0 left-0 flex items-center pl-2">
                  <IoIosSearch />
                </span>
                <input
                  placeholder="Search"
                  onChange={(e) => handleSearch(e.target.value)}
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
                       SKU
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
                  {products.length > 0 ? (
                      currentItems.map((product) => {
                        return (
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
                              {product?.sku}
                              </p>
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                              <p className="text-gray-900 whitespace-no-wrap">
                              {product?.category.name}
                              </p>
                            </td>
                            <td className="px-5  border-b border-gray-200 bg-white text-sm">
                              <div className="flex items-center justify-center lg:-ml-16">
                                <Link
                                  to={`/dashboard/updateproduct/${product?.id}`}
                                  className="p-2.5 bg-blue-500 rounded-xl hover:rounded-3xl hover:bg-blue-600 transition-all duration-300 text-white"
                                >
                                  <span className="text-lg text-center">
                                    <FaRegEdit />
                                  </span>
                                </Link>
                                <button
                                  onClick={() => removeProduct(product?.id)}
                                  className="ml-2 py-2.5 px-5 bg-red-500 rounded-xl hover:rounded-3xl hover:bg-red-600 transition-all duration-300 text-white"
                                >
                                  <span className="text-lg text-center">
                                    <RiDeleteBin6Line />
                                  </span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="5">
                          <p className="text-xl text-center xs:text-sm text-gray-900">
                            No users to display
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <div className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between          ">
                  <br />

                  <span className="text-xs xs:text-sm text-gray-900">
                    Showing {itemOffset + 1} to {endOffset} of{" "}
                    {products ? products.length : 0} Users
                  </span>

                  <div className="inline-flex mt-2 xs:mt-0">
                    <ReactPaginate
                      breakLabel="..."
                      previousLabel={<IoIosArrowBack />}
                      nextLabel={<IoIosArrowForward />}
                      onPageChange={handlePageClick}
                      pageRangeDisplayed={5}
                      pageCount={pageCount}
                      renderOnZeroPageCount={null}
                      containerClassName={
                        "flex  justify-center text-xs font-medium space-x-1"
                      }
                      previousLinkClassName={
                        "inline-flex bg-fuchsia-300 hover:bg-fuchsia-400/90 items-center justify-center w-8 h-8 border border-gray-100 rounded"
                      }
                      nextLinkClassName={
                        "inline-flex bg-fuchsia-300 hover:bg-fuchsia-400/90  items-center justify-center w-8 h-8 border border-gray-100 rounded"
                      }
                      disabledClassName={
                        "opacity-25 bg-fuchsia-50  focus:outline-none"
                      }
                      activeClassName={
                        "block w-8 h-8 text-center bg-fuchsia-600/90  text-white border-2 border-fuchsia-600/90  rounded leading-8"
                      }
                      pageClassName="block w-8 h-8 text-center  hover:bg-fuchsia-400/90  bg-fuchsia-300 border border-gray-100 rounded leading-8"
                    />
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
