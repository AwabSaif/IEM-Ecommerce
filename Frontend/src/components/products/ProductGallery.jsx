import React, { useEffect, useRef, useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import axios from "../../api/axios";
import { useDropzone } from "react-dropzone";
import useAuth from "../../hooks/useAuth";

const PRODUCT_IMAGES_URL = "/api/products/gallery-images/";

export const ProductGallery = ({ productId }) => {
  //auth
  const { auth } = useAuth();
  const token = auth.token;
//error
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");

  //loading
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  //message success
  const [successMessage, setSuccessMessage] = useState("");
  
  //form
  const [formData, setFormData] = useState({
    images: [],
  });
  const [files, setFiles] = useState([]);

  //input images
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "images/*",
    maxFiles: 5,
    onDrop: (acceptedFiles, fileRejections) => {
      setFiles(acceptedFiles);
      if (fileRejections.length > 0) {
        setErrMsg("Some files were rejected. Please only upload image files.");
        errRef.current.focus();
      } else {
        setErrMsg("");
      }
    },
  });

  //set message error
  useEffect(() => {
    setErrMsg("");
  }, [formData]);


  //send data
  const handleImageUpload = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`images`, file);
    });

    setFormData({
      ...formData,
      images: files,
    });

    try {
      const response = await axios.put(
        PRODUCT_IMAGES_URL + productId,
        formData,
        {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
          withCredentials: true,
        }
      );
      setFiles([]);
      setSuccessMessage("Images uploaded successfully!");
      setUploading(false);
      setIsLoading(false);
    } catch (err) {
      if (!err?.response) {
        setErrMsg("Server not responding");
        setIsLoading(false);
        setUploading(false);
      } else {
        setIsLoading(false);
        setUploading(false);
        setErrMsg(
          err.response.data.message ||
            "Error uploading images. Please try again."
        );
        errRef.current.focus();
      }
    }
  };

  return (
    <section className="mt-6 text-cyan-800">
      <form onSubmit={handleImageUpload}>
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
          <div className="bg-fuchsia-100 border border-fuchsia-400 text-fuchsia-700 px-2 py-2 mb-2  rounded relative">
            {successMessage}
          </div>
        )}
        <div className="-mt-4">
          <div className="-ml-11 p-4 max-w-72 bg-white w-max bg-whtie m-auto rounded-lg">
            <label
              htmlFor="product-image"
              className="mb-2 ml-16 block text-sm font-semibold leading-6 text-gray-900"
            >
              Add product images gallery
            </label>

            {!files.length && (
              <div className="absolute pointer-events-auto ml-7">
                <label
                  {...getRootProps({
                    className:
                      "mx-auto py-10 cursor-pointer flex w-[350px] md:w-[500px] lg:w-[550px] max-w-xl flex-col items-center rounded-xl border-2 border-dashed border-fuchsia-400 bg-white text-center",
                  })}
                >
                  {" "}
                  <span>
                    <IoCloudUploadOutline className="text-fuchsia-500 stroke-2 h-16 w-16 mx-auto mb-4" />
                  </span>
                  <input
                    className="text-sm cursor-pointer w-36 hidden"
                    {...getInputProps()}
                  />
                  <div className="mt-2 text-gray-500 tracking-wide">
                    {isDragActive
                      ? "Drop the files here ..."
                      : "Upload or drag & drop your files (PNG, JPG, or JPEG)."}
                  </div>
                </label>
              </div>
            )}

            {files.length > 0 && (
              <div className="max-w-52 absolute pointer-events-auto ml-7">
                <label className="mx-auto py-10 cursor-pointer flex  w-[350px] md:w-[500px] lg:w-[550px] flex-col items-center rounded-xl border-2 border-dashed border-fuchsia-400 bg-white text-center">
                  <div className="max-w-2xl mx-auto flex flex-wrap">
                    {files.map((file) => (
                      <div key={file.name} className="flex-shrink-0 mx-2 mb-2">
                        <img
                          className="max-h-32 object-cover"
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                        />
                      </div>
                    ))}
                  </div>
                  <input
                    className="text-sm cursor-pointer w-36 hidden"
                    type="file"
                    id="product-image"
                    name="image"
                    {...getInputProps()}
                  />
                </label>
              </div>
            )}

            {uploading && (
              <div className="flex items-center justify-center mt-4">
                <div className="loader"></div>
                <span className="ml-2 text-bluck">Uploading...</span>
              </div>
            )}
          </div>
        </div>
        <div className=" relative">
          {isLoading ? (
            <button className="absolute bottom-1 -mb-60 ml-36 hover:shadow-htmlForm w-full rounded-md bg-fuchsia-500 py-3 px-15 text-center text-base font-semibold text-white outline-none">
              Uploading...
            </button>
          ) : (
            <button className=" absolute bottom-1 -mb-60 ml-36 hover:shadow-htmlForm w-full rounded-md bg-fuchsia-500 py-3 px-15 text-center text-base font-semibold text-white outline-none">
              Add images gallery
            </button>
          )}
        </div>
      </form>
    </section>
  );
};
