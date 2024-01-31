import { useEffect, useRef, useState } from "react";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import { IoCloseCircleOutline, IoCloudUploadOutline } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";

const REGISTER_URL = "/api/categories";

export const AddCategory = () => {
  //auth
  const { auth } = useAuth();
  const token = auth.token;
  //error
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  //navigate link
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard/categories";
  //form
  const [name, setName] = useState("");
  const [color, setColor] = useState("#d946ef");
  const [icon, setIcon] = useState("");
  //message success
  const [successMessage, setSuccessMessage] = useState("");
  //preview input icon
  const [imagePreview, setImagePreview] = useState(null);
  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setIcon(selectedImage);
    const previewUrl = URL.createObjectURL(selectedImage);
    setImagePreview(previewUrl);
  };
  //loading
  const [isLoading, setIsLoading] = useState(false);
  //input icon
  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({
      noClick: true,
    });
  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {(file.size / 1024 / 1024).toFixed(2)} MB
    </li>
  ));

  //set error
  useEffect(() => {
    setErrMsg("");
  }, [name, color, icon]);
  //submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      setErrMsg(null);

      const formData = new FormData();
      formData.append("icon", icon, name);
      formData.append("name", name);
      formData.append("color", color);

      const response = await axios.post(REGISTER_URL, formData, {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
        withCredentials: true,
      });
      // console.log(response);
      setIsLoading(false);
      setSuccessMessage("Category created successfully");
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
            onClick={() => navigate(from, { replace: true })}
          >
            <span className="text-fuchsia-500 text-2xl">
              <IoCloseCircleOutline />
            </span>
          </button>
        </div>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <h3 className="mb-4  -ml-10 text-2xl font-medium ">Add Category</h3>
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
          <div className="flex  justify-between items-center">
            <div className="mb-5">
              <label
                htmlFor="color"
                className="mb-3 block text-base font-medium"
              >
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

            <div className="-mt-4">
              <div className="-ml-11 p-4 max-w-72 bg-white w-max bg-whtie m-auto rounded-lg">
                <label
                  htmlFor="category-icon"
                  className="mb-2 ml-8 block text-sm font-semibold leading-6 text-gray-900"
                >
                  Category icon
                </label>

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
          <div>
            {isLoading ? (
              <button className="hover:shadow-htmlForm w-full rounded-md bg-fuchsia-500 py-3 px-8 text-center text-base font-semibold text-white outline-none">
                Uploading...
              </button>
            ) : (
              <button className="hover:shadow-htmlForm w-full rounded-md bg-fuchsia-500 py-3 px-8 text-center text-base font-semibold text-white outline-none">
                Create Category
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
