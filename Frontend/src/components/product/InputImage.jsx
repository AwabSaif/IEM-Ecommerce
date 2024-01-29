import React from "react";
import { useDropzone } from "react-dropzone";
import { IoCloudUploadOutline } from "react-icons/io5";
export const InputImage = () => {
  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone();

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));
  return (
    <div className="-ml-11 p-4 max-w-72 bg-white w-max bg-whtie m-auto rounded-lg">
      <label
        htmlFor="product-image"
        className="mb-2 ml-8 block text-sm font-semibold leading-6 text-gray-900"
      >
        Product Image
      </label>

      <div className="absolute pointer-events-auto ml-7">
        <label
          {...getRootProps({
            className:
              "mx-auto py-20  cursor-pointer flex w-full max-w-lg flex-col items-center rounded-xl border-2 border-dashed border-fuchsia-400 bg-white p-6 text-center",
          })}
        >
          <span>
            <IoCloudUploadOutline className="text-fuchsia-500 stroke-2 h-16 w-16 mx-auto mb-4" />
          </span>
          <input
            className="text-sm cursor-pointer w-36 hidden"
            {...getInputProps({id:"product-image"})}     
            // value={formData.image}
            // onChange={handleImageChange}
            multiple
          />
           {/*   <input
                        className="text-sm cursor-pointer w-36 hidden"
                        type="file"
                        id="product-image"
                        name="image"
                        // value={formData.image}
                        onChange={handleImageChange}
                        multiple
                      /> */}

          <div className="mt-2 text-gray-500 tracking-wide">
            Upload or darg & drop <br /> your file PNG, JPG or jpeg.
          </div>
        </label>
      </div>
      <div className="max-w-52 absolute pointer-events-auto ml-7">
        {/*    <label className="mx-auto h-72 px-1 cursor-pointer flex w-60 max-w-72  flex-col items-center justify-center rounded-xl border-2 border-dashed border-fuchsia-400 bg-white text-center ">
  <img
            className="py-2 "
            // src={}
            alt="Product image"
          /> 
          <input
            className="text-sm cursor-pointer w-36 hidden"
            type="file"
            id="product-image"
            name="image"
            // value={formData.image}
            // onChange={}
          />
        </label> */}
        <aside>
          <h4 className="text-bluck">Files</h4>
          <ul className="text-bluck">{files}</ul>
        </aside>
      </div>

      {/*   
      {imagePreview && (
        <label className="mx-auto h-72 px-1 cursor-pointer flex w-60 max-w-72  flex-col items-center justify-center rounded-xl border-2 border-dashed border-fuchsia-400 bg-white text-center ">
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
            // value={formData.image}
            onChange={handleImageChange}
          />
        </label>
      
     */}
    </div>
  );
};
