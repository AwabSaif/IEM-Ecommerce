import React from "react";
import { NavLink ,useLocation } from "react-router-dom";

const activeLink = ({ isActive }) => (isActive ? "bg-gray-200 hover:bg-gray-400 font-bold py-2 px-4 border-b-4 border-blue-400 rounded-t-2xl" : "");
export const PageMenu = () => {
    const { pathname } = useLocation();
  return (
    <header className="bg-white drop-shadow-md border-b-4 border-blue-400">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 px-8"
        aria-label="Global"
      >

        <div className=" flex gap-x-12">
          <NavLink
            to="/profile"
            className={`${activeLink({
              isActive: pathname === "/profile",
            })} text-sm font-semibold leading-6 text-gray-900  hover:bg-gray-200 hover:font-bold py-2 px-4 rounded-t-2xl`}
            aria-current="page"
          >
           الملف الشخصي
          </NavLink>
          <NavLink
            to="/changepassword"
            className={`${activeLink({
              isActive: pathname === "/changepassword",
            })} text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-200 hover:font-bold py-2 px-4 rounded-t-2xl`}
            aria-current="page"
          >
            تغيير كلمة المرور
          </NavLink>
          <NavLink
            to="#"
            className={`${activeLink({
              isActive: pathname === "#",
            })} text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-200 hover:font-bold py-2 px-4 rounded-t-2xl`}
            aria-current="page"
          >
                المسخدمين
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
