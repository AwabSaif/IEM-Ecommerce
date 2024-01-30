import React, { useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { IoCloudUploadOutline } from "react-icons/io5";
export const InputImage = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const errRef = useRef();

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    acceptedFiles,
    fileRejections,
  } = useDropzone({
    accept: "image/*",
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

  

  const handleImageUpload = async () => {
    setUploading(true);
    // Implement your image upload logic here
    // After successful upload, you can set the success message and reset the files state
    try {
      // Your image upload logic goes here
      // Example: const response = await uploadImages(files);

      // Reset the state
      setFiles([]);
      setSuccessMessage("Images uploaded successfully!");
      setUploading(false);
    } catch (error) {
      console.error("Error uploading images:", error);
      setErrMsg("Error uploading images. Please try again.");
      setUploading(false);
    }
  };

  return (
    <section className="mt-6 text-cyan-800">
      <form>
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
              className="mb-2 ml-8 block text-sm font-semibold leading-6 text-gray-900"
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
                <label className="mx-auto py-10 cursor-pointer flex  w-[350px] md:w-[500px] lg:w-[550px] max-w-xl flex-col items-center rounded-xl border-2 border-dashed border-fuchsia-400 bg-white text-center">
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

            {files.length > 0 && !uploading && (
              <button
                type="button"
                className="mt-4 bg-fuchsia-500 text-white px-4 py-2 rounded hover:bg-fuchsia-600 focus:outline-none focus:shadow-outline-fuchsia active:bg-fuchsia-700"
                onClick={handleImageUpload}
              >
                Upload Images
              </button>
            )}
          </div>
        </div>
      </form>
    </section>
  );
};
