import { useEffect, useRef, useState } from "react";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import { IoCloseCircleOutline, IoCloudUploadOutline } from "react-icons/io5";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";

const REGISTER_URL = "/api/categories/";
const EDITCATEGORY_URL = "/api/categories/";

export const UpdateCategory = () => {
  // Authentication
  const { auth } = useAuth();
  const token = auth.token;

  // Get category ID from URL params
  const { id } = useParams();

  // Error handling
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");

  // Navigation
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };

  // Form state
  const [category, setCategory] = useState({});
  const [name, setName] = useState("");
  const [color, setColor] = useState("#d946ef");
  const [icon, setIcon] = useState("");
  const [showIcon, setShowIcon] = useState("");

  // Success message
  const [successMessage, setSuccessMessage] = useState("");

  // Preview input icon
  const [imagePreview, setImagePreview] = useState(null);
  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setIcon(selectedImage);
    const previewUrl = URL.createObjectURL(selectedImage);
    setImagePreview(previewUrl);
  };

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Input icon
  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({
      noClick: true,
    });
  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {(file.size / 1024 / 1024).toFixed(2)} MB
    </li>
  ));

  // Set error message
  useEffect(() => {
    setErrMsg("");
  }, [name, color, icon]);

  useEffect(() => {
    const fetchCategory = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(EDITCATEGORY_URL + id, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
          withCredentials: true,
        });
        setCategory(response.data);
      } catch (err) {
        setErrMsg("Failed to fetch user");
      } finally {
        setIsLoading(false);
      }
    };

    if (!category.id) {
      fetchCategory();
    }
  }, [category.id]);

  useEffect(() => {
    if (category.id) {
      setName(category.name);
      setColor(category.color);
      setShowIcon(category.icon);
    }
  }, [category]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      setErrMsg(null);

      const formData = new FormData();
      formData.append("icon", icon, name);
      formData.append("name", name);
      formData.append("color", color);

      const response = await axios.put(REGISTER_URL + id, formData, {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
        withCredentials: true,
      });

      setIsLoading(false);
      setSuccessMessage("Category updated successfully");
      setName("");
      setColor("");
      setIcon("");
    } catch (err) {
      if (!err?.response) {
        setIsLoading(false);
        setErrMsg("Server not responding");
        console.log(err);
      } else {
        setIsLoading(false);
        setErrMsg(err.response.data.message);
      }
      errRef.current.focus();
    }
  };

  return (
    <div className="flex items-center justify-center p-12">
      <div className="mx-auto w-full max-w-[550px] bg-white">
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
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <h3 className="mb-4  -ml-10 text-2xl font-medium ">
            Update Category
          </h3>
          {/* Error message */}
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
          {/* Success message */}
          {successMessage && (
            <div className=" bg-fuchsia-100 border border-fuchsia-400 text-fuchsia-700 px-2 py-2 mb-2  rounded relative">
              {successMessage}
            </div>
          )}
          {/* Category Name input */}
          <div className="mb-5">
            <label htmlFor="name" className="mb-3 block text-base font-medium">
              Category Name
            </label>
            <input
              onChange={(e) => setName(e.target.value)}
              type="text"
              name="name"
              id="name"
              value={name}
              placeholder="Category Name"
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium  outline-none focus:border-fuchsia-400  focus:shadow-md"
            />
          </div>
          {/* Color input */}
          <div className="mb-5">
            <label htmlFor="color" className="mb-3 block text-base font-medium">
              Color
            </label>
            <input
              onChange={(e) => setColor(e.target.value)}
              type="color"
              name="color"
              id="color"
              value={color}
              className="p-1 h-16  block bg-white border border-gray-200 cursor-pointer w-32  rounded-lg disabled:opacity-50 disabled:pointer-events-none "
              title="Choose your color"
            />
          </div>
          {/* Current Icon */}
          <div className="flex  justify-between items-center">
            <div className=" -ml-11 p-4 max-w-72 bg-white w-max bg-whtie m-auto rounded-lg">
              <label
                htmlFor="category-icon"
                className="mb-2 ml-8 block text-sm font-semibold leading-6 text-gray-900"
              >
                Current icon
              </label>
              <label className="ml-8  w-52 h-48 mb-5 cursor-pointer flex  max-w-lg flex-col justify-center items-center rounded-xl border-2 border-solid border-fuchsia-400 bg-white p-2 text-center">
                <img
                  className="max-h-48  object-cover"
                  src={showIcon}
                  alt="Product image"
                />
              </label>
            </div>
            {/* Category Icon */}
            <div className="-mt-4">
              <div className="-ml-11 p-4 max-w-72 bg-white w-max bg-whtie m-auto rounded-lg">
                <label
                  htmlFor="category-icon"
                  className="mb-2 ml-8 block text-sm font-semibold leading-6 text-gray-900"
                >
                  Category icon
                </label>
                {/* Upload icon */}
                {!imagePreview && (
                  <div className="ml-7">
                    <label
                      {...getRootProps({
                        className:
                          "mx-auto   cursor-pointer flex w-full max-w-lg flex-col items-center rounded-xl border-2 border-dashed border-fuchsia-400 bg-white p-6 text-center",
                      })}
                    >
                      {" "}
                      <span>
                        <IoCloudUploadOutline className="text-fuchsia-500 stroke-2 h-16 w-16 mx-auto mb-4" />
                      </span>
                      <input
                        className="text-sm cursor-pointer w-36 hidden"
                        {...getInputProps()}
                        name="icon"
                        id="category-icon"
                        value={icon}
                        onChange={handleImageChange}
                      />
                      <div className="mt-2 text-gray-500 tracking-wide">
                        Upload your file PNG, JPG or JEPG.
                      </div>
                    </label>
                  </div>
                )}
                {/* Preview uploaded icon */}
                <div className="max-w-52 ml-7">
                  {imagePreview && (
                    <label className="mx-auto  cursor-pointer flex w-full max-w-lg flex-col items-center rounded-xl border-2 border-dashed border-fuchsia-400 bg-white p-6 text-center">
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
          </div>
          {/* Submit button */}
          <div>
            {isLoading ? (
              <button className="hover:shadow-htmlForm w-full rounded-md bg-fuchsia-500 py-3 px-8 text-center text-base font-semibold text-white outline-none">
                Uploading...
              </button>
            ) : (
              <button className="hover:shadow-htmlForm w-full rounded-md bg-fuchsia-500 py-3 px-8 text-center text-base font-semibold text-white outline-none">
                Update
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};