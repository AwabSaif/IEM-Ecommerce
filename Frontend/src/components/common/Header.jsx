import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import useLogout from "../../hooks/useLogout";
import useAuth from "../../hooks/useAuth";
import UseToggle from "../../hooks/UseToggle";
import useCart from "../../hooks/useCart";
import { Search } from "../search input/Search";

import logoImage from "../../assets/image/IEM Ecommerce-logo.png";
import { HiOutlinePhone } from "react-icons/hi2";
import { BsCart2 } from "react-icons/bs";
import { IoIosArrowDown, IoMdClose } from "react-icons/io";
import { HiOutlineLogin } from "react-icons/hi";
import { GrMenu } from "react-icons/gr";

const activeNavLink = ({ isActive }) => (isActive ? "active" : "");

export const Header = () => {
  //navigate
  const navigate = useNavigate();
  const { pathname } = useLocation();

  //auth
  const { auth } = useAuth();
  const admin = auth.roles;
  const id = auth.id;

  //log out
  const logout = useLogout();
  const signOut = async () => {
    await logout();
    navigate("/");
    alert("You are logged out");
  };

  //open nav
  const [isMenuOpen, toggleMenu] = UseToggle(false);
  const [isHeaderOpen, setIsHeaderOpen] = useState(false);
  const [isButtonClick, setIsButtonClick] = useState(false);

  // Cart
  const { handleOpenCart, CartQuantity } = useCart();

  const handleOpenClick = () => {
    setIsButtonClick(false);
    setIsHeaderOpen(true);
  };

  const handleCloseClick = () => {
    setIsButtonClick(false);
    setIsHeaderOpen(false);
  };

  return (
    <header className="h-28  lg-drop-shadow-md ">
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
          <button
            onClick={() => handleOpenCart()}
            className="text-sm ml-3 mr-2 flex p-2 rounded-full border-2 border-fuchsia-500   text-gray-900  hover:bg-fuchsia-200  hover:font-bold   "
          >
            <span className=" absolute mt-2.5 ml-6  bg-fuchsia-500 p-2.5  flex h-2 w-1 items-center justify-center rounded-full text-xs text-white">
              {CartQuantity}
            </span>
            <BsCart2 className=" text-2xl" />
          </button>
        </div>

        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <img
              className="h-auto w-[110px] "
              src={logoImage}
              alt={logoImage}
            />
          </Link>
        </div>

        <div className="hidden lg:flex lg:gap-x-3">
          <NavLink
            to="/"
            className={`${activeNavLink({
              isActive: pathname === "/",
            })} text-sm font-semibold leading-6 text-gray-900  hover:bg-fuchsia-200 hover:font-bold py-2 px-4 rounded-t-2xl`}
            aria-current="page"
          >
            Home
          </NavLink>
          <NavLink
            to="/store"
            className={`${activeNavLink({
              isActive: pathname === "/store",
            })} text-sm font-semibold leading-6 text-gray-900  hover:bg-fuchsia-200  hover:font-bold py-2 px-4 rounded-t-2xl`}
            aria-current="page"
          >
            Store
          </NavLink>
          <NavLink
            to="/categories"
            className={`${activeNavLink({
              isActive: pathname === "/categories",
            })} text-sm font-semibold leading-6 text-gray-900   hover:bg-fuchsia-200  hover:font-bold py-2 px-4 rounded-t-2xl`}
            aria-current="page"
          >
            Categories
          </NavLink>
          <div className="w-[280px]">
            <Search />
          </div>
          <div className="relative">
            <button
              type="button"
              className="flex  items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900   hover:bg-fuchsia-200  hover:font-bold py-2 px-4 rounded-t-2xl"
              aria-current="page"
              aria-expanded={isMenuOpen}
              onClick={toggleMenu}
            >
              More
              <IoIosArrowDown />
            </button>
            {isMenuOpen && (
              <div
                onMouseLeave={toggleMenu}
                className="absolute -right-[80px] top-full z-10  w-screen max-w-[250px] overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-fuchsia-900/5 "
              >
                <div className="p-4 flex flex-col items-center justify-center">
                  {admin && (
                    <div className=" rounded-lg p-4 text-sm leading-6  hover:bg-fuchsia-200 ">
                      <Link
                        to="/dashboard"
                        className="block font-semibold text-gray-900"
                      >
                        Dashboard
                      </Link>
                    </div>
                  )}
                  {id && (
                    <>
                      <div className=" rounded-lg p-4 text-sm leading-6  hover:bg-fuchsia-200 ">
                        <Link
                          to={`/orders/${id}`}
                          className="block  font-semibold text-gray-900"
                        >
                          Orders
                        </Link>
                      </div>
                      <div className=" rounded-lg p-4 text-sm leading-6  hover:bg-fuchsia-200 ">
                        <Link
                          to={`edituser/${id}`}
                          className="block  font-semibold text-gray-900"
                        >
                          Profile
                        </Link>
                      </div>
                      <div className=" rounded-lg p-4 text-sm leading-6  hover:bg-fuchsia-200 ">
                        <button
                          onClick={signOut}
                          className="block  font-semibold text-gray-900"
                        >
                          Sign out
                        </button>
                      </div>
                    </>
                  )}
                </div>

                <Link
                  to="/contactus"
                  className="flex items-center justify-center gap-x-2.5 p-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-100"
                >
                  <HiOutlinePhone className="text-2xl" />
                  Connact us
                </Link>
              </div>
            )}
          </div>
        </div>
        <div
          className="hidden lg:flex lg:flex-1 lg:justify-end "
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={() => handleOpenCart()}
            className="text-sm mr-2 flex p-2 rounded-full border-2 border-fuchsia-500   text-gray-900  hover:bg-fuchsia-200  hover:font-bold   "
          >
            <span className=" absolute mt-2.5 ml-6  bg-fuchsia-500 p-2.5  flex h-2 w-1 items-center justify-center rounded-full text-xs text-white">
              {CartQuantity}
            </span>
            <BsCart2 className=" text-2xl" />
          </button>
          <NavLink
            to="/login"
            className="text-sm flex   items-center justify-items-center font-semibold leading-6 text-gray-900 hover:font-bold py-2 px-4 "
          >
            <HiOutlineLogin className="text-2xl pl-1" />
            Sign in
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
        <div className="fixed inset-y-0 laft-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
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
            <div className="-my-6 divide-y divide-fuchsia-500/10">
              <div className="space-y-2 py-6">
                <div>
                  <Search />
                </div>
                <NavLink
                  to="/"
                  className={`${activeNavLink({
                    isActive: pathname === "/",
                  })} -mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900  hover:bg-fuchsia-200 `}
                  aria-current="page"
                >
                  Home
                </NavLink>
                <NavLink
                  to="/store"
                  className={`${activeNavLink({
                    isActive: pathname === "/store",
                  })} -mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900  hover:bg-fuchsia-200 `}
                  aria-current="page"
                >
                  Store
                </NavLink>
                <NavLink
                  to="/categories"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900  hover:bg-fuchsia-200 "
                >
                  Categories
                </NavLink>
              </div>
              <div className="-mx-3">
                <button
                  type="button"
                  className={`${activeNavLink(
                    {}
                  )} flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900  hover:bg-fuchsia-200 `}
                  aria-expanded={isMenuOpen}
                  onClick={toggleMenu}
                >
                  More
                  <IoIosArrowDown />
                </button>
                {isMenuOpen && (
                  <div className="mt-2 space-y-2" id="disclosure-1">
                    {admin && (
                      <NavLink
                        to="/dashboard"
                        className="flex   justify-items-center rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900  hover:bg-fuchsia-200 "
                      >
                        Dashboard
                      </NavLink>
                    )}
                    {id && (
                      <>
                        <NavLink
                          to={`/orders/${id}`}
                          className=" flex   justify-items-center  rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900  hover:bg-fuchsia-200 "
                        >
                          Orders
                        </NavLink>
                        <NavLink
                          to={`edituser/${id}`}
                          className=" flex   justify-items-center  rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900  hover:bg-fuchsia-200 "
                        >
                          Profile
                        </NavLink>
                        <button
                          onClick={signOut}
                          className=" flex   justify-items-center  rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900  hover:bg-fuchsia-200 "
                        >
                          Sign out
                        </button>
                      </>
                    )}
                    <NavLink
                      to="/contactus"
                      className=" flex  justify-items-center  rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900  hover:bg-fuchsia-200 "
                    >
                      Connact us
                    </NavLink>
                  </div>
                )}
              </div>
              <div className="py-6">
                <NavLink
                  to="/login"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900  hover:bg-fuchsia-200 "
                >
                  Sign in
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
