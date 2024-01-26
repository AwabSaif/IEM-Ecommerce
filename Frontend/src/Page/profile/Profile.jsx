import { useState } from "react";
import profileImage from "../../assets/image/22Untitled.png";

const initialState = {
  name: "Awab",
  email: "Awab@admin.com",
  phone: "05506",
  pio: "anything",
  photo: "",
  role: "",
  isVerified: false,
};

export const Profile = () => {
  const [profile, setProfile] = useState("");
  const handleImageChainge = () => {};
  const handleInputChainge = () => {};
  return (
    <>
      <PageMenu />
      <section className="grid place-content-center    ">
        <h2 className="mb-2 text-lg font-medium">Profile</h2>
        <div className=" max-w-sm   top-full z-10  w-screen  overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5 ">
          <div className="flex flex-col items-center justify-center   shadow-sm shadow-neutral-100 ">
            <div className="flex items-center  mt-4 justify-center">
              <img
                className="w-2/5 rounded-full"
                src={profileImage}
                alt="Sunset in the mountains"
              />
            </div>
            <h3 className="mb-4 text-lg font-medium">Role:Subscriber</h3>
          </div>
          <form className="px-6 py-4">
            <div className="mb-4">
              <label htmlFor="FileLg" className="text-md font-medium">
                Change image:
              </label>
              <input
                className=" mt-1 w-full  cursor-pointer rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-1  leading-[2.15] text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none  "
                id="FileLg"
                type="file"
                accept="image/*"
                name="image"
                onChange={handleImageChainge}
              />
            </div>
            <div>
              <label htmlFor="name" className="text-md font-medium">
                Name:
              </label>
              <input
                className="w-full px-4 mt-1 py-2 text-sm border border-gray-300 border-solid rounded"
                type="text"
                id="name"
                name="name"
                value={profile.name}
                onChange={handleInputChainge}
              />
            </div>
            <div>
              <label htmlFor="email" className="text-md font-medium">
                Email:
              </label>
              <input
                className="w-full px-4 py-2 mt-1 text-sm border border-gray-300 border-solid rounded"
                type="email"
                id="email"
                disabled
                name="email"
                value={profile.email}
                onChange={handleInputChainge}
              />
            </div>
            <div>
              <label htmlFor="phone" className="text-md font-medium">
                Phone:
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 mt-1 text-sm border border-gray-300 border-solid rounded"
                id="phone"
                name="phone"
                value={profile.phone}
                onChange={handleInputChainge}
              />
            </div>
            <div>
              <label htmlFor="bio" className="text-md font-medium">
                Bio:
              </label>
              <textarea
                className="w-full px-4 py-2 mt-1 text-sm border border-gray-300 border-solid rounded"
                name="bio"
                id="bio"
                cols="30"
                rows="10"
                value={profile.bio}
                onChange={handleInputChainge}
              ></textarea>
            </div>
            <div className="mt-3 flex items-center justify-center">
              <button className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4   rounded-full">
              Update account
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};
