import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import axios from "../../api/axios";
import { useDropzone } from "react-dropzone";
import { IoCloudUploadOutline, IoCloseCircleOutline } from "react-icons/io5";

import { ProductGallery } from "./ProductGallery";

const GET_CATEGORY_URL = "/api/categories";

const PRODUCT_URL = "/api/products";

export const AddProduct = () => {
  const { auth } = useAuth();
  const token = auth.token;
  const errRef = useRef();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard/products";

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    richDescription: "",
    brand: "",
    price: "",
    sku: "",
    category: "",
    countInStock: "",
    image: null,
  });

  const [categoryList, setCategoryList] = useState([]);
  const [category, setCategory] = useState({
    id: "",
    value: "",
  });

  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({
      noClick: true,
    });

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {(file.size / 1024 / 1024).toFixed(2)} MB
    </li>
  ));

  const [imagePreview, setImagePreview] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  //show modal password
  const [showModal, setShowModal] = useState(false);

  const [productId, setProductId] = useState("");
  useEffect(() => {
    setErrMsg("");
  }, [formData]);

  useEffect(() => {
    axios
      .get(GET_CATEGORY_URL)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setCategoryList(res.data);
        } else {
          console.error("API response is not an array");
        }
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
        setErrMsg(err.message);
      });
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setFormData({
      ...formData,
      image: selectedImage,
    });

    const previewUrl = URL.createObjectURL(selectedImage);
    setImagePreview(previewUrl);
  };

  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    const selectedCategory = categoryList.find(
      (category) => category.id === selectedCategoryId
    );

    setCategory({
      id: selectedCategoryId,
      value: selectedCategory ? selectedCategory.name : "",
    });

    setFormData({
      ...formData,
      category: selectedCategoryId,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const postData = new FormData();

    for (const key in formData) {
      if (key === "image") {
        const fileNameWithoutExtension = formData[key].name.split(".")[0];
        const newFileName = `${fileNameWithoutExtension}`;

        postData.append("image", formData[key], newFileName);
      } else {
        postData.append(key, formData[key]);
      }
    }

    try {
      const response = await axios.post(PRODUCT_URL, postData, {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
        withCredentials: true,
      });
      setProductId(response.data.id);
      setSuccessMessage("Product created successfully");
      setIsLoading(false);
    } catch (err) {
      if (!err?.response) {
        setErrMsg("Server not responding");
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setErrMsg(err.response.data.message);
      }
      errRef.current.focus();
    }
  };

  return (
    <div className="flex items-center justify-center p-12">
      <div className="mx-auto w-full max-w-[950px] bg-white">
        <div className="relative ">
          <button
            className={`absolute cursor-pointer  white  -right-1 rounded-full  `}
            onClick={() => navigate(from, { replace: true })}
          >
            <span className="text-fuchsia-500 text-2xl">
              <IoCloseCircleOutline />
            </span>
          </button>
        </div>
        <h3 className="mb-4  -ml-10 text-2xl font-medium ">Add Product</h3>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <div
              ref={errRef}
              className={
                errMsg
                  ? "bg-fuchsia-100 border border-fuchsia-400 text-fuchsia-700 px-2 py-2 mb-2  rounded relative"
                  : "hidden"
              }
              aria-live="assertive"
              role="alert"
            >
              <span className="block sm:inline">{errMsg}</span>
            </div>
            {successMessage && (
              <>
                <div className=" bg-fuchsia-100 border border-fuchsia-400 text-fuchsia-700 px-2 py-2 mb-2  rounded relative">
                  {successMessage}
                </div>
                <div className="mt-2 ml-4">
                  <Link
                    onClick={() => window.location.reload()}
                    className="hover:shadow-htmlForm w-full  rounded-md bg-fuchsia-500 py-2.5  px-11 text-center text-base font-semibold text-white outline-none"
                  >
                    Add new product
                  </Link>
                </div>
              </>
            )}
            <div className="sm:col-span-2">
              <label
                htmlFor="product-name"
                className="mb-2 block text-sm font-semibold leading-6 text-gray-900"
              >
                Product Name
              </label>

              <input
                type="text"
                id="product-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className=" w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium  outline-none focus:border-fuchsia-400  focus:shadow-md"
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="short-description"
                className="mb-2 block text-sm font-semibold leading-6 text-gray-900"
              >
                Short description
              </label>

              <input
                type="text"
                name="richDescription"
                id="short-description"
                value={formData.richDescription}
                onChange={handleInputChange}
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium  outline-none focus:border-fuchsia-400  focus:shadow-md"
              />
            </div>
            <div className="-mt-4">
              <div className="-ml-11 p-4 max-w-72 bg-white w-max bg-whtie m-auto rounded-lg">
                <label
                  htmlFor="product-image"
                  className="mb-2 ml-8 block text-sm font-semibold leading-6 text-gray-900"
                >
                  Product Image
                </label>

                {!imagePreview && (
                  <div className="absolute pointer-events-auto ml-7">
                    <label
                      {...getRootProps({
                        className:
                          "mx-auto py-20  cursor-pointer flex w-full max-w-lg flex-col items-center rounded-xl border-2 border-dashed border-fuchsia-400 bg-white p-6 text-center",
                      })}
                    >
                      {" "}
                      <span>
                        <IoCloudUploadOutline className="text-fuchsia-500 stroke-2 h-16 w-16 mx-auto mb-4" />
                      </span>
                      <input
                        className="text-sm cursor-pointer w-36 hidden"
                        {...getInputProps()}
                        name="image"
                        id="product-image"
                        onChange={handleImageChange}
                        multiple
                      />
                      <div className="mt-2 text-gray-500 tracking-wide">
                        Upload your file PNG, JPG <br />
                        or JEPG.
                      </div>
                      {/*  or darg & drop <br /> */}
                    </label>
                  </div>
                )}
                <div className="max-w-52 absolute pointer-events-auto ml-7">
                  {imagePreview && (
                    <label className="mx-auto h-72 px-1 cursor-pointer flex w-60 max-w-72  flex-col items-center justify-center rounded-xl border-2 border-dashed border-fuchsia-400 bg-white text-center ">
                      <img
                        className="max-h-72  object-cover"
                        src={imagePreview}
                        alt="Product image"
                      />
                      <input
                        className="text-sm cursor-pointer w-36 hidden"
                        {...getInputProps()}
                        name="image"
                        id="product-image"
                        onChange={handleImageChange}
                        multiple
                      />
                      <aside>
                        <ul className="text-bluck">{files}</ul>
                      </aside>
                    </label>
                  )}
                </div>
              </div>
            </div>
            <div className=" pointer-events-auto">
              <div>
                <label
                  htmlFor="brand"
                  className="mb-2 block text-sm font-semibold leading-6 text-gray-900"
                >
                  Brand
                </label>

                <input
                  type="text"
                  name="brand"
                  id="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-[#e0e0e0] bg-white px-3.5 py-2.5 text-base font-medium  outline-none focus:border-fuchsia-400  focus:shadow-md"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-semibold leading-6 text-gray-900"
                >
                  Product Category
                </label>
                {Array.isArray(categoryList) && (
                  <select
                    id="category"
                    name="category"
                    value={category.id}
                    onChange={handleCategoryChange}
                    className="w-full rounded-md border border-[#e0e0e0] bg-white px-3.5 py-2.5 text-base font-medium  outline-none focus:border-fuchsia-400  focus:shadow-md"
                  >
                    <option>Category</option>
                    {categoryList.map((categoryItem) => (
                      <option key={categoryItem.id} value={categoryItem.id}>
                        {categoryItem.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="mb-2 block text-sm font-semibold leading-6 text-gray-900"
                >
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  id="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-[#e0e0e0] bg-white px-3.5 py-2.5 text-base font-medium  outline-none focus:border-fuchsia-400  focus:shadow-md"
                />
              </div>

              <div>
                <label
                  htmlFor="quantity"
                  className="mb-2 block text-sm font-semibold leading-6 text-gray-900"
                >
                  Quantity
                </label>

                <input
                  type="number"
                  id="quantity"
                  name="countInStock"
                  value={formData.countInStock}
                  min="1"
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-[#e0e0e0] bg-white px-3.5 py-2.5 text-base font-medium  outline-none focus:border-fuchsia-400  focus:shadow-md"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="sku"
                className="mb-2 block text-sm font-semibold leading-6 text-gray-900"
              >
                SKU
              </label>
              <input
                type="text"
                name="sku"
                id="sku"
                value={formData.sku}
                onChange={handleInputChange}
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium  outline-none focus:border-fuchsia-400  focus:shadow-md"
              />
            </div>

            <div className="sm:col-span-2 mt-10">
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-semibold leading-6 text-gray-900"
              >
                Product Description
              </label>

              <textarea
                name="description"
                id="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium  outline-none focus:border-fuchsia-400  focus:shadow-md"
              />
            </div>

            <div className="flex gap-x-4 sm:col-span-2">
              <div className="flex h-6 items-center"></div>
            </div>
          </div>
          {!showModal ? (
            <div className="mt-10">
              {isLoading ? (
                <button className="hover:shadow-htmlForm w-full rounded-md bg-fuchsia-500 py-3 px-8 text-center text-base font-semibold text-white outline-none">
                  Uploading...
                </button>
              ) : (
                <button className="hover:shadow-htmlForm w-full rounded-md bg-fuchsia-500 py-3 px-8 text-center text-base font-semibold text-white outline-none">
                  Publish
                </button>
              )}
            </div>
          ) : null}
        </form>
        <div className="-mt-80 ml-44 absolute flex items-center justify-center ">
          {!showModal ? (
            <button
              className="bg-fuchsia-500 -ml-44  w-[260px] text-white active:bg-fuchsia-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 -mt-7  mb-1 ease-linear transition-all duration-150"
              type="button"
              onClick={() => setShowModal(true)}
            >
              Add product gallery
            </button>
          ) : null}
          {showModal ? (
            <>
              <div className="relative ">
                <button
                  className={` cursor-pointer  white top-6  -lift-1 rounded-full  `}
                  onClick={() => setShowModal(false)}
                >
                  <span className="text-fuchsia-500 text-2xl">
                    <IoCloseCircleOutline />
                  </span>
                </button>
              </div>

              <ProductGallery productId={productId} />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
