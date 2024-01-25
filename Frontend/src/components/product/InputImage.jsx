/* import { useEffect, useRef, useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";

export const InputImage = () => {
  const [profileImage, setProfileImage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
    setImagePreview(URL.createObjectURL(e.target.files[0]));
  };

  const uploadImage = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageUrl;

      if (
        profileImage &&
        (profileImage.type === "image/png" ||
          profileImage.type === "image/jpg" ||
          profileImage.type === "image/jpeg")
      ) {
        const upload_preset = process.env.VITE_UPLOAD_PRESET; // تأكد من أنك قد قمت بتعيين process.env.VITE_UPLOAD_PRESET في ملف .env
        const cloudName = "IEMEcommoeres"; // قم بتعيين اسم السحابة الخاص بك
        const formData = new FormData();
        
        formData.append("file", profileImage);
        formData.append("cloud_name", cloudName);
        formData.append("upload_preset", upload_preset);

        const response = await fetch(
          "https://api.cloudinary.com/v1_1/" + cloudName + "/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const imgData = await response.json();
        imageUrl = imgData.url.toString();
        setImagePreview(null);
      }
      
      alert(imageUrl);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      <form onSubmit={uploadImage}>
        <div className="p-4 bg-white w-max bg-whtie m-auto rounded-lg">
          <label
            htmlFor="product-gallery"
            className="mb-2 block text-sm font-semibold leading-6 text-gray-900"
          >
            Product gallery
          </label>

          <div className="py-5 w-64 ml-7 relative border-4 border-dotted border-gray-300 rounded-lg">
            <div className="flex flex-col w-max mx-auto text-center">
              <label>
                <span>
                  <IoCloudUploadOutline className="text-indigo-500 stroke-2 h-24 w-24 mx-auto mb-4" />
                </span>
                <input
                  className="text-sm cursor-pointer w-36 hidden"
                  type="file"
                  name="product-gallery"
                  id="product-gallery"
                  onChange={handleImageChange}
                  multiple
                />
              </label>

              <div className="text-indigo-500 uppercase">
                or drop files here
              </div>
              <div className="max-w-52">
                <p>
                  {isLoading ? (
                    "Uploading..."
                  ) : (
                    <button className="block w-full rounded-md bg-indigo-600 px-5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                      Upload Image
                    </button>
                  )}
                </p>
                {imagePreview && (
                  <img
                    className="py-2"
                    src={imagePreview}
                    alt="Product image"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};
 */

import React, { useEffect, useState } from "react";
// import axios from "axios";
import axios from "../../api/axios";
import { IoCloudUploadOutline } from "react-icons/io5";

const GET_CATEGORY_URL = "/api/categories";
const PRODUCT_URL = "/api/products";

export const InputImage = () => {
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
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    const selectedCategory = categoryList.find((category) => category.id === selectedCategoryId);
  
    setCategory({
      id: selectedCategoryId,
      value: selectedCategory ? selectedCategory.name : "",
    });
  
    setFormData({
      ...formData,
      category: selectedCategoryId, // قم بتعيين القيمة المباشرة بدلاً من تحويلها إلى نص
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
   
    const postData = new FormData();
    /*   for (const key in formData) {
      postData.append(key, formData[key]);
    } */
    for (const key in formData) {
      postData.append(key, formData[key]);
    }
    // postData.append("category", category.id);
    console.log(formData);

    try {
      
      console.log(formData);

      const response = await axios.post(PRODUCT_URL, postData,{
        withCredentials: true,
      });
      // const response = await axios.post("http://localhost:5000/api/products", postData);
      console.log("Product created successfully:", response.data);
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };
  
  return (
    <div>
      <h2>Create Product</h2>
      <form onSubmit={handleSubmit}>
        {/* Your input fields */}
        <label>Name:</label>
        <input type="text" name="name" onChange={handleInputChange} />
        <label>description:</label>
        <input type="text" name="description" onChange={handleInputChange} />
        {/* <label>category:</label>
      <input type="text" name="category" onChange={handleInputChange} /> */}
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
        <label>countInStock:</label>
        <input type="number" name="countInStock" onChange={handleInputChange} />

        {/* Add other input fields similarly */}

        {/* File input for image */}
        <label>Image:</label>
        <input type="file" name="image" onChange={handleImageChange} />

        <button type="submit">Create Product</button>
      </form>
    </div>
  );
};
