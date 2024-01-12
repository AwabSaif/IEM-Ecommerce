import React, { useEffect, useRef, useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import axios from "../../api/axios";
import { ProductGallery } from "./ProductGallery";

const GET_CATEGORY_URL = "/api/categories";
const PRODUCT_URL = "/api/products";
const PRODUCT_IMAGES_URL =
  "/api/products/gallery-images/659c36ebf6ff3c1b5ef387be";

export const AddProduct = () => {
  const [createdProductId, setCreatedProductId] = useState(null);
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
  const [imagesData, setImagesData] = useState({
    images: null,
  });

  const [categoryList, setCategoryList] = useState([]);
  const [category, setCategory] = useState({
    id: "",
    value: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageGalleryPreview, setImageGalleryPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleImagesGalleryChange = (e) => {
    const selectedImage = e.target.files[0];
    setImagesData({
      ...imagesData,
      images: selectedImage,
    });

    // إنشاء رابط للصورة المحددة
    const previewUrl = URL.createObjectURL(selectedImage);
    setImageGalleryPreview(previewUrl);
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
      postData.append(key, formData[key]);
    }

    try {
      console.log(imagesData);
      const response = await axios.post(PRODUCT_URL, postData);
     // const resad = await axios.post(PRODUCT_IMAGES_URL, postData);
      setIsLoading(false);
      console.log("Product created successfully:", response.data);
      setCreatedProductId(response.data.id); // افتراضًا أن معرف المنتج يتم استرجاعه من الرد
    } catch (error) {
      console.error("Error creating product:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
      {createdProductId && <ProductGallery />}

      <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]">
        <div
          className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Add Product
        </h2>
        <p className="mt-2 text-lg leading-8 text-gray-600"></p>
      </div>
      <form onSubmit={handleSubmit} className="mx-auto mt-16 max-w-xl sm:mt-20">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          {/*    <div
            ref={errRef}
            className={
              errMsg
                ? "bg-red-100 border border-red-400 text-red-700 px-2 py-2 mb-2  rounded relative"
                : "hidden"
            }
            aria-live="assertive"
            role="alert"
          >
            <span className="block sm:inline">{errMsg}</span>
          </div> */}
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
              onChange={handleInputChange}
              className=" block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
              onChange={handleInputChange}
              className=" block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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

              <div className="py-5 px-2 ml-7 w-56 h-[255px]  relative border-4 border-dotted border-gray-300 rounded-lg">
                <div className="flex flex-col w-max mx-auto text-center">
                  {!imagePreview && (
                    <div>
                      <label>
                        <span>
                          <IoCloudUploadOutline className="text-indigo-500 stroke-2 h-24 w-24 mx-auto mb-4" />
                        </span>
                        <input
                          className="text-sm cursor-pointer w-36 hidden"
                          type="file"
                          id="product-image"
                          name="image"
                          onChange={handleImageChange}
                          multiple
                        />
                      </label>

                      <div className="text-indigo-500 uppercase">
                        or drop files here
                      </div>
                    </div>
                  )}
                  <div className="max-w-52">
                    {imagePreview && (
                      <label>
                        <img
                          className="py-2 "
                          src={imagePreview}
                          alt="Product image"
                        />
                        <input
                          className="text-sm cursor-pointer w-36 hidden"
                          type="file"
                          id="product-image"
                          name="image"
                          onChange={handleImageChange}
                          multiple
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
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
                onChange={handleInputChange}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                  className="block w-full rounded-md border-0 px-3.5 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                type="text"
                name="price"
                id="price"
                onChange={handleInputChange}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                min="1"
                onChange={handleInputChange}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
              onChange={handleInputChange}
              className=" block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
              onChange={handleInputChange}
              className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              defaultValue={""}
            />
          </div>
          <div className="flex gap-x-4 sm:col-span-2">
            <div className="flex h-6 items-center"></div>
          </div>
        </div>
        <div>
        <div className="p-4 -ml-4 md:w-[607px]  bg-white bg-whtie rounded-lg">
          <label
            htmlFor="product-gallery"
            className="mb-2 block text-sm font-semibold leading-6 text-gray-900"
          >
            Product Gallery
          </label>

          <div className="block w-full border-4 border-dotted border-gray-300 rounded-lg px-3.5 py-2 text-gray-900    focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
            <div className="w-max mx-auto text-center">
              {!imagePreview && (
                <div>
                  <label>
                    <span>
                      <IoCloudUploadOutline className="text-indigo-500 stroke-2 h-24 w-24 mx-auto mb-4" />
                    </span>
                    <input
                      className="text-sm cursor-pointer w-36 hidden"
                      type="file"
                      id="product-image"
                      name="image"
                      onChange={handleImagesGalleryChange}
                      multiple
                    />
                  </label>

                  <div className="text-indigo-500 uppercase">
                    or drop files here
                  </div>
                </div>
              )}
              <div className="max-w-52">
                {imagePreview && (
                  <label>
                    <img
                      className="py-2"
                      src={imageGalleryPreview}
                      alt="Product image"
                    />
                    <input
                      className="text-sm cursor-pointer w-36 hidden"
                      type="file"
                      id="product-image"
                      name="image"
                      onChange={handleImagesGalleryChange}
                      multiple
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>
        </div>
        <div className="mt-10">
          {isLoading ? (
            "Uploading..."
          ) : (
            <button
              type="submit"
              className="block  w-full rounded-md bg-indigo-600 px-5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Publish
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
