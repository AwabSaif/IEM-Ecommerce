import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import logo from "../../../assets/image/IEM Ecommerce-logo.png";
import { AiOutlineHome, AiOutlineInbox } from "react-icons/ai";
import { IoIosLogOut } from "react-icons/io";
import { IoSettingsOutline, IoPersonAddOutline } from "react-icons/io5";
import { HiOutlineUserGroup, HiOutlineUser } from "react-icons/hi2";
import { BsArrowLeftCircleFill } from "react-icons/bs";
import { RiAddCircleLine } from "react-icons/ri";
import useLogout from "../../../hooks/useLogout";
import { HiOutlineClipboardList } from "react-icons/hi";
import { LuArchive } from "react-icons/lu";
import { LuLayoutDashboard } from "react-icons/lu";

import { TbCategory, TbCategoryPlus } from "react-icons/tb";

const Sidebar = () => {
  const { auth } = useAuth();
  const id = auth.id;
  const name = auth.name;

  const [open, setOpen] = useState(true);
  const logout = useLogout();
  const navigate = useNavigate();

  const signOut = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div
      className={` ${
        open ? "w-60" : "w-20 "
      } bg-withe-100 h-max  p-5  pt-8 relative duration-300 shadow-lg shadow-fuchsia-500/40 `}
    >
      <button
        src="./src/assets/control.png"
        className={`absolute cursor-pointer -right-3 top-9 
        border-2 rounded-full  ${!open && "rotate-180"}`}
        onClick={() => setOpen(!open)}
      >
        <span className="text-fuchsia-400 text-2xl">
          <BsArrowLeftCircleFill />
        </span>
      </button>
      <div  className={`text-fuchsia-400 text-xl  origin-left font-medium  duration-200 ${!open && "duration-200  hidden "}`}
      >
        Hello {name}
      </div>

      <div>
        <Link className="flex w-14 gap-x-4 items-center" to="/dashboard">
          <img
            src={logo}
            className={`cursor-pointer duration-500 ${
              open && "rotate-[360deg]"
            }`}
          />
          <h1
            className={`text-gray-800 origin-left font-medium text-xl duration-200 ${
              !open && "scale-0"
            }`}
          >
            Menu
          </h1>
        </Link>
      </div>
      {/* Menu */}
      <div className="overflow-y-auto overflow-x-hidden flex-grow">
        <ul className="flex flex-col py-4 space-y-1">
          <li className="flex -ml-4 rounded-lg p-2 cursor-pointer hover:bg-fuchsia-100 text-gray-700 text- items-center gap-x-4">
            <Link
              to="/"
              className=" flex flex-row focus:outline-none   px-3 py-2 text-base font-semibold leading-7 text-gray-900 "
            >
              <span className="inline-flex justify-center items-center text-2xl mr-3">
                <AiOutlineHome />
              </span>

              <span className={`${!open && "hidden"} origin-left duration-200`}>
                Home
              </span>
            </Link>
          </li>
          <li className="flex -ml-4 rounded-lg p-2 cursor-pointer hover:bg-fuchsia-100 text-gray-700 text- items-center gap-x-4">
            <Link
              to="/dashboard"
              className=" flex flex-row focus:outline-none   px-3 py-2 text-base font-semibold leading-7 text-gray-900 "
            >
              <span className="inline-flex justify-center items-center text-2xl mr-3">
                <LuLayoutDashboard />
              </span>

              <span className={`${!open && "hidden"} origin-left duration-200`}>
                Dashboard
              </span>
            </Link>
          </li>
          {/*orders  */}
          <li className="px-5 ml-5">
            <div className="flex flex-row items-center h-8">
              <div className="text-sm font-light tracking-wide text-gray-500">
                Orders
              </div>
            </div>
          </li>
          <li className="flex -ml-4 rounded-lg p-2 cursor-pointer hover:bg-fuchsia-100 text-gray-700 text- items-center gap-x-4">
            <Link
              to="/dashboard/orders"
              className=" flex flex-row focus:outline-none   px-3 py-2 text-base font-semibold leading-7 text-gray-900 "
            >
              <span className="inline-flex justify-center items-center text-2xl mr-3">
                <HiOutlineClipboardList />
              </span>

              <span className={`${!open && "hidden"} origin-left duration-200`}>
                Orders
              </span>
            </Link>
          </li>
          {/* <li className="flex -ml-4 rounded-lg p-2 cursor-pointer hover:bg-fuchsia-100 text-gray-700 text- items-center gap-x-4">
            <Link
              to="/dashboard/addproduct"
              className=" flex flex-row focus:outline-none   px-3 py-2 text-base font-semibold leading-7 text-gray-900 "
            >
              <span className="inline-flex justify-center items-center text-2xl mr-3">
                <RiAddCircleLine />
              </span>

              <span className={`${!open && "hidden"} origin-left duration-200`}>
                Add Order
              </span>
            </Link>
          </li> */}
          {/*Products  */}
          <li className="px-5 ml-5">
            <div className="flex flex-row items-center h-8">
              <div className="text-sm font-light tracking-wide text-gray-500">
                Products
              </div>
            </div>
          </li>
          <li className="flex -ml-4 rounded-lg p-2 cursor-pointer hover:bg-fuchsia-100 text-gray-700 text- items-center gap-x-4">
            <Link
              to="/dashboard/products"
              className=" flex flex-row focus:outline-none   px-3 py-2 text-base font-semibold leading-7 text-gray-900 "
            >
              <span className="inline-flex justify-center items-center text-2xl mr-3">
                <LuArchive />
              </span>

              <span className={`${!open && "hidden"} origin-left duration-200`}>
                Products
              </span>
            </Link>
          </li>
          <li className="flex -ml-4 rounded-lg p-2 cursor-pointer hover:bg-fuchsia-100 text-gray-700 text- items-center gap-x-4">
            <Link
              to="/dashboard/addproduct"
              className=" flex flex-row focus:outline-none   px-3 py-2 text-base font-semibold leading-7 text-gray-900 "
            >
              <span className="inline-flex justify-center items-center text-2xl mr-3">
                <RiAddCircleLine />
              </span>

              <span className={`${!open && "hidden"} origin-left duration-200`}>
                Add Product
              </span>
            </Link>
          </li>
          {/* Categories */}
          <li className="px-5 ml-5">
            <div className="flex flex-row items-center h-8">
              <div className="text-sm font-light tracking-wide text-gray-500">
                Categories
              </div>
            </div>
          </li>
          <li className="flex -ml-4 rounded-lg p-2 cursor-pointer hover:bg-fuchsia-100 text-gray-700 text- items-center gap-x-4">
            <Link
              to="/dashboard/categories"
              className=" flex flex-row focus:outline-none   px-3 py-2 text-base font-semibold leading-7 text-gray-900 "
            >
              <span className="inline-flex justify-center items-center text-2xl mr-3">
                <TbCategory />
              </span>

              <span className={`${!open && "hidden"} origin-left duration-200`}>
                Categories
              </span>
            </Link>
          </li>
          <li className="flex -ml-4 rounded-lg p-2 cursor-pointer hover:bg-fuchsia-100 text-gray-700 text- items-center gap-x-4">
            <Link
              to="/dashboard/addcategory"
              className=" flex flex-row focus:outline-none   px-3 py-2 text-base font-semibold leading-7 text-gray-900 "
            >
              <span className="inline-flex justify-center items-center text-2xl mr-3">
                <TbCategoryPlus />
              </span>

              <span className={`${!open && "hidden"} origin-left duration-200`}>
                Add Category
              </span>
            </Link>
          </li>

          {/* users  */}
          <li className="px-5 ml-5">
            <div className="flex flex-row items-center h-8">
              <div className="text-sm font-light tracking-wide text-gray-500">
                Users
              </div>
            </div>
          </li>

          <li className="flex -ml-4 rounded-lg p-2 cursor-pointer hover:bg-fuchsia-100 text-gray-700 text- items-center gap-x-4">
            <Link
              to="/dashboard/users"
              className=" flex flex-row focus:outline-none   px-3 py-2 text-base font-semibold leading-7 text-gray-900 "
            >
              <span className="inline-flex justify-center items-center text-2xl mr-3">
                <HiOutlineUserGroup />
              </span>

              <span className={`${!open && "hidden"} origin-left duration-200`}>
                Users
              </span>
            </Link>
          </li>
          <li className="flex -ml-4 rounded-lg p-2 cursor-pointer hover:bg-fuchsia-100 text-gray-700 text- items-center gap-x-4">
            <Link
              to="/dashboard/adduser"
              className=" flex flex-row focus:outline-none   px-3 py-2 text-base font-semibold leading-7 text-gray-900 "
            >
              <span className="inline-flex justify-center items-center text-2xl mr-3">
                <IoPersonAddOutline />
              </span>

              <span className={`${!open && "hidden"} origin-left duration-200`}>
                Add User
              </span>
            </Link>
          </li>
          {/* Settings */}
          <li className="px-5 ml-5">
            <div className="flex flex-row items-center h-8">
              <div className="text-sm font-light tracking-wide text-gray-500">
                Settings
              </div>
            </div>
          </li>
          <li className="flex -ml-4 rounded-lg p-2 cursor-pointer hover:bg-fuchsia-100 text-gray-700 text- items-center gap-x-4">
            <Link
              to={`/edituser/${id}`}
              className=" flex flex-row focus:outline-none   px-3 py-2 text-base font-semibold leading-7 text-gray-900 "
            >
              <span className="inline-flex justify-center items-center text-2xl mr-3">
                <HiOutlineUser />
              </span>

              <span className={`${!open && "hidden"} origin-left duration-200`}>
                Profile
              </span>
            </Link>
          </li>
          <li className="flex -ml-4 rounded-lg p-2 cursor-pointer hover:bg-fuchsia-100 text-gray-700 text- items-center gap-x-4">
            <Link
              to="/"
              className=" flex flex-row focus:outline-none   px-3 py-2 text-base font-semibold leading-7 text-gray-900 "
            >
              <span className="inline-flex justify-center items-center text-2xl mr-3">
                <IoSettingsOutline />
              </span>

              <span className={`${!open && "hidden"} origin-left duration-200`}>
                Settings
              </span>
            </Link>
          </li>

          <li className="flex -ml-4 rounded-lg p-2 cursor-pointer hover:bg-fuchsia-100 text-gray-700 text- items-center gap-x-4">
            <button
              onClick={signOut}
              className=" flex flex-row focus:outline-none   px-3 py-2 text-base font-semibold leading-7 text-gray-900 "
            >
              <span className="inline-flex justify-center items-center text-2xl mr-3">
                <IoIosLogOut />
              </span>

              <span className={`${!open && "hidden"} origin-left duration-200`}>
                Sign out
              </span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
