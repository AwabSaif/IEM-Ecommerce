import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import axios from "../../api/axios";
import { useDropzone } from "react-dropzone";
import { IoCloudUploadOutline, IoCloseCircleOutline } from "react-icons/io5";
import { ProductGallery } from "./ProductGallery";

const GET_CATEGORY_URL = "/api/categories";

const PRODUCT_URL = "/api/products/";

export const UpdateProduct = () => {
  //auth
  const { auth } = useAuth();
  const token = auth.token;
  //id from link
  const { id } = useParams();

  //error
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");

  //preview input image
  const [imagePreviewServer, setImagePreviewServer] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imagesPreviewServer, setImagesPreviewServer] = useState([]);

  //loading
  const [isLoading, setIsLoading] = useState(false);

  //message success
  const [successMessage, setSuccessMessage] = useState("");

  //product id after save
  const [productId, setProductId] = useState("");

  //show modal password
  const [showModal, setShowModal] = useState(false);

  // navigate link

  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };
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

  // category
  const [categoryList, setCategoryList] = useState([]);
  const [category, setCategory] = useState({
    id: "",
    value: "",
  });

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

  //input image
  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({
      noClick: true,
    });

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {(file.size / 1024 / 1024).toFixed(2)} MB
    </li>
  ));

  useEffect(() => {
    setErrMsg("");
  }, [formData]);

  //handle input
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      setFormData({
        ...formData,
        image: selectedImage,
      });
      const previewUrl = URL.createObjectURL(selectedImage);
      setImagePreview(previewUrl);
    }
  };

  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    const selectedCategory = categoryList.find(
      (category) => category.id === selectedCategoryId
    );
    setCategory(selectedCategory);

    setFormData({
      ...formData,
      category: selectedCategory ? selectedCategory.id : "",
    });
  };

  //get data from server
  useEffect(() => {
    if (id) {
      axios
        .get(`${PRODUCT_URL}${id}`)
        .then((response) => {
          setFormData({
            name: response.data.name,
            description: response.data.description,
            richDescription: response.data.richDescription,
            brand: response.data.brand,
            price: response.data.price,
            sku: response.data.sku,
            category: response.data.category.id,
            countInStock: response.data.countInStock,
            image: null,
          });

          const selectedCategory = categoryList.find(
            (category) => category.id === response.data.category
          );
          setCategory(response.data.category.id);

          setImagePreviewServer(response.data.image);
          setImagesPreviewServer(response.data.images);
        })

        .catch((error) => {
          console.error("Error fetching product:", error);
          setErrMsg(error.message);
        });
    }
  }, [id]);

  //send form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const postData = new FormData();

    if (formData.image) {
      const fileNameWithoutExtension = formData.image.name.split(".")[0];
      const newFileName = `${fileNameWithoutExtension}`;
      postData.append("image", formData.image, newFileName);
    }

    for (const key in formData) {
      if (key !== "image") {
        postData.append(key, formData[key]);
      }
    }
    try {
      const response = await axios.put(PRODUCT_URL + id, postData, {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
        withCredentials: true,
      });
      // console.log(response);
      setProductId(response.data.id);

      setSuccessMessage("Product updated successfully");
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
            onClick={handleGoBack}
          >
            <span className="text-fuchsia-500 text-2xl">
              <IoCloseCircleOutline />
            </span>
          </button>
        </div>
        <h3 className="mb-4  -ml-10 text-2xl font-medium ">Edit Product</h3>

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
                  value={category}
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
          <div>
            <div className="flex items-center  justify-between">
              <div className="pointer-events-auto">
                <div className="-mt-4">
                  <div className="-ml-11 p-4 max-w-72 bg-white w-max bg-whtie m-auto rounded-lg">
                    <label
                      htmlFor="product-image"
                      className="mb-2 ml-8 block text-sm font-semibold leading-6 text-gray-900"
                    >
                      Product Image
                    </label>
                    <div
                      className="bg-red-100  mb-2 border border-red-400 w-[400px] ml-7 text-red-700 px-4 rounded relative"
                      role="alert"
                    >
                      <strong className="font-bold text-sm">Note! </strong>
                      <span className="block text-sm sm:inline">
                        Please add an image before update.
                      </span>
                    </div>

                    {!imagePreview && (
                      <div className="pointer-events-auto ml-7">
                        <label
                          {...getRootProps({
                            className:
                              "mx-auto py-20 cursor-pointer flex w-[400px] max-w-lg  flex-col items-center rounded-xl border-2 border-dashed border-fuchsia-400 bg-white p-6 text-center",
                          })}
                        >
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
                            or JPEG.
                          </div>
                        </label>
                      </div>
                    )}
                    <div className="max-w-72 ml-8">
                      {imagePreview && (
                        <label className="mx-auto py-20 cursor-pointer flex w-[400px] max-w-lg  flex-col items-center rounded-xl border-2 border-dashed border-fuchsia-400 bg-white p-6 text-center">
                          <img
                            className="max-h-72 object-cover"
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
                            <ul className="text-black">{files}</ul>
                          </aside>
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <label className="max-h-[300px] w-[450px] -mb-[70px] -ml-2 mx-auto h-80 py-20 cursor-pointer flex  max-w-lg flex-col items-center rounded-xl border-2 border-solid border-fuchsia-400 bg-white p-6 text-center">
                  <img
                    className="max-h-72 -mt-20 object-cover"
                    src={imagePreviewServer}
                    alt="Product image"
                  />
                </label>
              </div>
            </div>

            <div className="flex  items-center ">
              {imagesPreviewServer && (
                <div className="w-full">
                  <label className="mx-auto py-10 flex  flex-col items-center rounded-xl border-2 border-solid border-fuchsia-400 bg-white text-center">
                    <div className="mx-auto flex flex-wrap">
                      {imagesPreviewServer.map((image, index) => (
                        <div key={index} className="flex-shrink-0 mx-2 mb-2">
                          <img
                            className="max-h-32 object-cover"
                            src={image}
                            alt={`Image ${index + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="">
            <div className="mb-16 mt-6 sm:col-span-2">
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

            <div className="sm:col-span-2">
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
              className="bg-fuchsia-500 -ml-44  w-[260px] text-white active:bg-fuchsia-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1   mb-1 ease-linear transition-all duration-150"
              type="button"
              onClick={() => setShowModal(true)}
            >
              Update product gallery
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
