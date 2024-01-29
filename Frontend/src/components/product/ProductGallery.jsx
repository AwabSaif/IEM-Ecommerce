import React, { useEffect, useRef, useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import axios from "../../api/axios";
import { useDropzone } from "react-dropzone";

const PRODUCT_IMAGES_URL = "/api/products/gallery-images/";

export const ProductGallery = () => {
  const errRef = useRef();

 
  const [formData, setFormData] = useState({
    images: [], // تخزين الصور المتعددة
  });
  
  // const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
  //   useDropzone({
  //     noClick: true,
  //   });
  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({
    noClick: true,
    multiple: true, // تمكين تحديد ملفات متعددة
  });
  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {(file.size / 1024 / 1024).toFixed(2)} MB
    </li>
  ));

  // const [imagePreview, setImagePreview] = useState(null);
  const imagePreviews = acceptedFiles.map((file) => (
    <img
      key={file.path}
      className="py-2"
      src={URL.createObjectURL(file)}
      alt={file.path}
    />
  ));

  // const [isDragging, setIsDragging] = useState(false);
  // const fileInputRef = useRef(null);

  const [errMsg, setErrMsg] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // function selectFile() {
  //   fileInputRef.current.click();
  // }

  useEffect(() => {
    setErrMsg("");
  }, [formData]);

  
  const handleImageChange = (e) => {
    const newImages = Array.from(e.target.files);
    setFormData({
      ...formData,
      images: [...formData.images, ...newImages], // إضافة الصور الجديدة
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
      const response = await axios.post(PRODUCT_URL, postData, {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
        withCredentials: true,
      });
      setSuccessMessage("Product created successfully");
      setIsLoading(false);
      console.log("Product created successfully:", response.data);
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
    <section className=" mt-6 ">
      <form onSubmit={handleSubmit}>
      
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
          <div className=" bg-fuchsia-100 border border-fuchsia-400 text-fuchsia-700 px-2 py-2 mb-2  rounded relative">
            {successMessage}
          </div>
        )}
        <div className="-mt-4">
          <div className="-ml-11 p-4 max-w-72 bg-white w-max bg-whtie m-auto rounded-lg">
            <label
              htmlFor="product-image"
              className="mb-2 ml-8 block text-sm font-semibold leading-6 text-gray-900"
            >
              Add product images gallery
            </label>

            {!imagePreviews.length && (
              <div className="absolute pointer-events-auto ml-7">
                <label
                  {...getRootProps({
                    className:
                      "mx-auto py-10  cursor-pointer flex w-[350px] md:w-[500px] lg:w-[550px] max-w-xl  flex-col items-center rounded-xl border-2 border-dashed border-fuchsia-400 bg-white  text-center",
                  })}
                >
                  {" "}
                  <span>
                    <IoCloudUploadOutline className="text-fuchsia-500 stroke-2 h-16 w-16 mx-auto mb-4" />
                  </span>
                  <input
                    className="text-sm cursor-pointer w-36 hidden"
                    {...getInputProps()}
                    // value={formData.image}
                    onChange={handleImageChange}
                    multiple
                  />
                  <div className="mt-2 text-gray-500 tracking-wide">
                    Upload or darg & drop <br /> your file PNG, JPG or jpeg.
                  </div>
                </label>
              </div>
            )}
            <div className="max-w-52 absolute pointer-events-auto ml-7">
            {imagePreviews.length > 0 && (
                <label className="mx-auto py-10  cursor-pointer flex w-[350px] md:w-[500px] lg:w-[550px] max-w-xl  flex-col items-center rounded-xl border-2 border-dashed border-fuchsia-400 bg-white  text-center">
              {/*     <img
                    className="py-2 "
                    src={imagePreview}
                    alt="Product image"
                  /> */}
                  <input
                    className="text-sm cursor-pointer w-36 hidden"
                    type="file"
                    id="product-image"
                    name="image"
                    onChange={handleImageChange}
                    {...getInputProps()}
                  />
                  <aside>
                    <ul className="text-bluck">{files}</ul>
                  </aside>
                </label>
              )}
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};
