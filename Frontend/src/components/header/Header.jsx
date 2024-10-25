import { NavLink ,Link, useLocation } from "react-router-dom";
import { HiOutlinePhone } from "react-icons/hi2";
import { MdSpaceDashboard } from "react-icons/md";
import { IoIosArrowDown, IoMdClose, IoIosLogOut } from "react-icons/io";
import { HiOutlineLogin } from "react-icons/hi";
import { GrMenu } from "react-icons/gr";
import logoImage from "../../assets/image/IEM Ecommerce-logo.png";
import UseToggle from "../../hooks/useToggle";
import { useState } from "react";

const activeNavLink = ({ isActive }) => (isActive ? "active" : "");

export const Header = () => {
  const { pathname } = useLocation();
  const [isMenuOpen, toggleMenu] = UseToggle(false);
  const [isHeaderOpen, setIsHeaderOpen] = useState(false);
  const [isButtonClick, setIsButtonClick] = useState(false);

 
  const toggleHeader = () => {
    setIsHeaderOpen(!isHeaderOpen);
    setIsButtonClick(true);
  };

  const handleOpenClick = () => {
    setIsButtonClick(false);
    setIsHeaderOpen(true);
  };

  const handleCloseClick = () => {
    setIsButtonClick(false);
    setIsHeaderOpen(false);
  };

  return (
    <header className="bg-white lg-drop-shadow-md ">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:hidden   ">
          <button
            type="button"
            className=" -m-2.5 inline-flex items-center justify-center rounded-md p-2.5  text-gray-700"
            onClick={handleOpenClick}
            disabled={isButtonClick}
          >
            <GrMenu />
          </button>
        </div>

        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <img className="h-16 w-auto " src={logoImage} alt={logoImage} />
          </Link>
        </div>

        <div className="hidden lg:flex lg:gap-x-12">
          <NavLink
            to="/"
            className={`${activeNavLink({
              isActive: pathname === "/",
            })} text-sm font-semibold leading-6 text-gray-900  hover:bg-gray-200 hover:font-bold py-2 px-4 rounded-t-2xl`}
            aria-current="page"
          >
            الصفحه الرئيسيه
          </NavLink>
          <NavLink
            to="/profile"
            className={`${activeNavLink({
              isActive: pathname === "/profile",
            })} text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-200 hover:font-bold py-2 px-4 rounded-t-2xl`}
            aria-current="page"
          >
            الملف الشخصي
          </NavLink>
          <NavLink
            to="/dashboard"
            className={`${activeNavLink({
              isActive: pathname === "/dashboard",
            })} text-sm font-semibold leading-6 text-gray-900  hover:bg-gray-200 hover:font-bold py-2 px-4 rounded-t-2xl`}
            aria-current="page"
          >
            فارغ
          </NavLink>
          <div className="relative">
            <button
              type="button"
              className={`${activeNavLink({
                isActive: pathname === "/user",
              })} flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900  hover:bg-gray-200 hover:font-bold py-2 px-4 rounded-t-2xl`}
              aria-current="page"
              aria-expanded={isMenuOpen}
              onClick={toggleMenu}
            >
              المزيد
              <IoIosArrowDown />
            </button>
            {isMenuOpen && (
              <div className="absolute -right-[160px] top-full z-10  w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5 ">
                <div className="p-4">
                  <div className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-200">
                    <MdSpaceDashboard  className="text-xl -ml-4" />
                    <div className="flex-auto">
                      <Link
                        to="/profile"
                        className="block font-semibold text-gray-900"
                      >
                        لوحة التحكم
                        <span className="absolute inset-0"></span>
                      </Link>
                    </div>
                  </div>
                  <div className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-200">
                    <IoIosLogOut className="text-xl -ml-4" />
                    <div className="flex-auto">
                      <Link
                        to="#"
                        className="block font-semibold text-gray-900"
                      >
                        تسجيل الخروج
                        <span className="absolute inset-0"></span>
                      </Link>
                    </div>
                  </div>
                </div>

                <Link
                  to="#"
                  className="flex items-center justify-center gap-x-2.5 p-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-100"
                >
                  <HiOutlinePhone className="text-xl" />
                  تواصل معنا
                </Link>
              </div>
            )}
          </div>
        </div>
        <div
          className="hidden lg:flex lg:flex-1 lg:justify-end"
          role="dialog"
          aria-modal="true"
        >
          <NavLink
            to="/login"
            className="text-sm flex    items-center justify-items-center font-semibold leading-6 text-gray-900  hover:bg-gray-200 hover:font-bold py-2 px-4 rounded-t-2xl"
          >
            <HiOutlineLogin className="mt-1 text-xl pl-1" />
            تسجيل الدخول
          </NavLink>
        </div>
      </nav>

      <div
        className={`lg:hidden ${
          isHeaderOpen && !isButtonClick ? "" : "hidden"
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div className="fixed inset-0 z-10"></div>
        <div className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link to="/" className="-m-1.5 p-1.5">
              <img className="h-16  w-auto" src={logoImage} alt={logoImage} />
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={handleCloseClick}
              disabled={isButtonClick}
            >
              <IoMdClose className="text-2xl" />
            </button>
          </div>

          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <NavLink
                  to="/"
                  className={`${activeNavLink({
                    isActive: pathname === "/",
                  })} -mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-200`}
                  aria-current="page"
                >
                  الصفحه الرئيسيه
                </NavLink>
                <NavLink
                  to="/profile"
                  className={`${activeNavLink({
                    isActive: pathname === "/profile",
                  })} -mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-200`}
                  aria-current="page"
                >
                  الملف الشخصي
                </NavLink>
                <NavLink
                  to="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-200"
                >
                 فارغ
                </NavLink>
              </div>
              <div className="-mx-3">
                <button
                  type="button"
                  className={`${activeNavLink({
                    isActive: pathname === "/user",
                  })} flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-200`}
                  aria-current="page"
                  aria-controls="disclosure-1"
                  aria-expanded={isMenuOpen}
                  onClick={toggleMenu}
                >
                  المزيد
                  <IoIosArrowDown />
                </button>
                {isMenuOpen && (
                  <div className="mt-2 space-y-2" id="disclosure-1">
                    <NavLink
                      to="/dashboard"
                      className="flex  items-center justify-items-center rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-200"
                    >
                      <MdSpaceDashboard  className="mt-1 text-xl pl-1" />
                      لوحة التحكم
                    </NavLink>
                    <NavLink
                      to="#"
                      className=" flex  items-center justify-items-center  rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-200"
                    >
                      <IoIosLogOut className="mt-1 text-xl pl-1 " />
                      تسجيل الخروج
                    </NavLink>
                    <NavLink
                      to="#"
                      className=" flex  items-center justify-items-center  rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-200"
                    >
                      <HiOutlinePhone className="mt-1 text-xl pl-1  " />
                      تواصل معنا
                    </NavLink>
                  </div>
                )}
              </div>
              <div className="py-6">
                <NavLink
                  to="/login"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-200"
                >
                  تسجيل الدخول
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
