import { AiOutlineHome, AiOutlineInbox } from "react-icons/ai";
import { BiMessageDetail } from "react-icons/bi";
import { IoIosNotificationsOutline, IoIosLogOut } from "react-icons/io";
import { PiNotepadBold } from "react-icons/pi";
import { IoSettingsOutline } from "react-icons/io5";
import { HiOutlineUserGroup, HiOutlineUser } from "react-icons/hi2";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <>
      <div className="min-h-screen flex flex-col flex-auto flex-shrink-0 antialiased bg-gray-50 text-gray-800">
        <div className="fixed flex flex-col  top-0 lift-0 w-64 bg-white h-full border-r ">
          <div className="overflow-y-auto overflow-x-hidden flex-grow">
            <ul className="flex flex-col py-4 space-y-1">
              <li className="px-5">
                <div className="flex flex-row items-center h-8">
                  <div className="text-sm font-light tracking-wide text-gray-500">
                  Menu
                  </div>
                </div>
              </li>
              <li>
               <Link
                  to="/"
                  className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 border-l-4 border-transparent hover:border-indigo-500 pr-6"
                >
                  <span className="inline-flex justify-center items-center text-xl ml-4">
                    <AiOutlineHome />
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">
                  Home
                  </span>
                </Link>
              </li>
              <li>
               <Link
                  to="/"
                  className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 border-l-4 border-transparent hover:border-indigo-500 pr-6"
                >
                  <span className="inline-flex justify-center items-center text-xl ml-4">
                    <AiOutlineInbox />
                  </span>

                  <span className="ml-2 text-sm tracking-wide truncate">
                  Inbox
                  </span>
                  <span className="px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-indigo-500 bg-indigo-50 rounded-full">
                  new
                  </span>
                </Link>
              </li>
              <li>
               <Link
                  to="#"
                  className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 border-l-4 border-transparent hover:border-indigo-500 pr-6"
                >
                  <span className="inline-flex justify-center items-center text-xl ml-4">
                    <BiMessageDetail />
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">
                  Messages
                  </span>
                </Link>
              </li>
              <li>
               <Link
                  to="#"
                  className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 border-l-4 border-transparent hover:border-indigo-500 pr-6"
                >
                  <span className="inline-flex justify-center items-center text-xl ml-4">
                    <IoIosNotificationsOutline />
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">
                  Notifications
                  </span>
                  <span className="px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-red-500 bg-red-50 rounded-full">
                    1.2k
                  </span>
                </Link>
              </li>
              <li className="px-5">
                <div className="flex flex-row items-center h-8">
                  <div className="text-sm font-light tracking-wide text-gray-500">
                  Tasks
                  </div>
                </div>
              </li>
              <li>
               <Link
                  to="/dashboard/addproduct"
                  className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 border-l-4 border-transparent hover:border-indigo-500 pr-6"
                >
                  <span className="inline-flex justify-center items-center text-xl ml-4">
                    <PiNotepadBold />
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">
                 Add Product
                  </span>
                </Link>
              </li>
              <li>
               <Link
                  to="#"
                  className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 border-l-4 border-transparent hover:border-indigo-500 pr-6"
                >
                  <span className="inline-flex justify-center items-center text-xl ml-4">
                    <HiOutlineUserGroup />
                  </span>

                  <span className="ml-2 text-sm tracking-wide truncate">Users</span>
                  <span className="px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-green-500 bg-green-50 rounded-full">
                    15
                  </span>
                </Link>
              </li>
              <li className="px-5">
                <div className="flex flex-row items-center h-8">
                  <div className="text-sm font-light tracking-wide text-gray-500">
                  Settings
                  </div>
                </div>
              </li>
              <li>
               <Link
                  to="#"
                  className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 border-l-4 border-transparent hover:border-indigo-500 pr-6"
                >
                  <span className="inline-flex justify-center items-center text-xl ml-4">
                    <HiOutlineUser />
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">
                  Profile 
                  </span>
                </Link>
              </li>
              <li>
               <Link
                  to="#"
                  className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 border-l-4 border-transparent hover:border-indigo-500 pr-6"
                >
                  <span className="inline-flex justify-center items-center text-xl ml-4">
                    <IoSettingsOutline />
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">
                  Settings
                  </span>
                </Link>
              </li>
              <li>
               <Link
                  to="/login"
                  className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 border-l-4 border-transparent hover:border-indigo-500 pr-6"
                >
                  <span className="inline-flex justify-center items-center text-xl ml-4">
                    <IoIosLogOut />
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">
                  Sign out
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
          <h2>6546545</h2>
      </div>
    </>
  );
}
