import React, { useEffect, useRef, useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import axios from "../../api/axios";

const PRODUCT_IMAGES_URL = "/api/products/gallery-images/";

export const ProductGallery = () => {
  const [formData, setFormData] = useState({
    images: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  function selectFile() {
    fileInputRef.current.click();
  }

  const handleImagesGalleryChange = (e) => {
    const selectedImage = e.target.files[0];
    setImagesData({
      ...imagesData,
      images: selectedImage,
    });

    // إنشاء رابط للصورة المحددة
    const previewUrl = URL.createObjectURL(selectedImage);
    setImagePreview(previewUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const postData = new FormData();

    for (const key in formData) {
      postData.append(key, formData[key]);
    }

    try {
      const response = await axios.post(PRODUCT_IMAGES_URL, postData);
      setIsLoading(false);
      console.log("Product created successfully:", response.data);
    } catch (error) {
      console.error("Error creating product:", error);
      setIsLoading(false);
    }
  };
  return (
    <section className=" ">
      <form onSubmit={handleSubmit}>
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
                  <label role="button" onClick={selectFile}>
                    <input
                      className="text-sm cursor-pointer w-36 hidden"
                      type="file"
                      id="product-image"
                      name="image"
                      // onChange={handleImagesGalleryChange}
                      multiple
                      ref={fileInputRef}
                    />
                    {isDragging ? (
                      <div className="text-indigo-500 uppercase">
                        or drop files here
                      </div>
                    ) : (
                      <>
                        <span>
                          <IoCloudUploadOutline className="text-indigo-500 stroke-2 h-24 w-24 mx-auto mb-4" />
                        </span>
                      </>
                    )}
                  </label>
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
                      onChange={selectFile}
                      multiple
                      ref={fileInputRef}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

/* <div className="flex p-0 m-0">
          <div className="-ml-11 p-4 max-w-72 bg-white w-max bg-whtie m-auto rounded-lg">
            <label
              htmlFor="product-image"
              className="mb-2 ml-8 block text-sm font-semibold leading-6 text-gray-900"
            >
              Product Image
            </label>

            <div className="py-5 px-2 ml-7 relative border-4 border-dotted border-gray-300 rounded-lg">
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
 */
