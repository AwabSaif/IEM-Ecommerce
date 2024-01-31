import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { HiOutlinePhone } from "react-icons/hi2";
import { MdSpaceDashboard } from "react-icons/md";
import { IoIosArrowDown, IoMdClose, IoIosLogOut } from "react-icons/io";
import { HiOutlineLogin } from "react-icons/hi";
import { GrMenu } from "react-icons/gr";
import logoImage from "../../assets/image/IEM Ecommerce-logo.png";
import UseToggle from "../../hooks/useToggle";
import { useState } from "react";
import useLogout from "../../hooks/useLogout";
import { LuLayoutDashboard } from "react-icons/lu";
import useAuth from "../../hooks/useAuth";

const activeNavLink = ({ isActive }) => (isActive ? "active" : "");

export const Header = () => {
  //navigate
  const navigate = useNavigate();
  const { pathname } = useLocation();

  //auth
  const { auth } = useAuth();
  const admin = auth.roles;

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

  /*   const toggleHeader = () => {
    setIsHeaderOpen(!isHeaderOpen);
    setIsButtonClick(true);
  }; */

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

        <div className="hidden lg:flex lg:gap-x-12">
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
            to="/profile"
            className={`${activeNavLink({
              isActive: pathname === "/profile",
            })} text-sm font-semibold leading-6 text-gray-900  hover:bg-fuchsia-200  hover:font-bold py-2 px-4 rounded-t-2xl`}
            aria-current="page"
          >
            Profile
          </NavLink>
          <NavLink
            to="/dashboard/users"
            className={`${activeNavLink({
              isActive: pathname === "/dashboard/users",
            })} text-sm font-semibold leading-6 text-gray-900   hover:bg-fuchsia-200  hover:font-bold py-2 px-4 rounded-t-2xl`}
            aria-current="page"
          >
            Users
          </NavLink>
          <div className="relative">
            <button
              type="button"
              className={`${activeNavLink({
                isActive: pathname === "/user",
              })} flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900   hover:bg-fuchsia-200  hover:font-bold py-2 px-4 rounded-t-2xl`}
              aria-current="page"
              aria-expanded={isMenuOpen}
              onClick={toggleMenu}
            >
              More
              <IoIosArrowDown />
            </button>
            {isMenuOpen && (
              <div className="absolute -right-[160px] top-full z-10  w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5 ">
                <div className="p-4">
                  {admin && (
                    <div className="group relative  gap-x-6 rounded-lg p-4 text-sm leading-6  hover:bg-fuchsia-200 ">
                      <div className="flex-auto">
                        <Link
                          to="/dashboard"
                          className="block font-semibold ml-4 text-gray-900"
                        >
                          Dashboard
                          <span className="absolute inset-0 top-5">
                            <LuLayoutDashboard className="text-xl " />
                          </span>
                        </Link>
                      </div>
                    </div>
                  )}
                  <div className="group relative gap-x-6 rounded-lg p-4 text-sm leading-6  hover:bg-fuchsia-200 ">
                    <div className="flex-auto">
                      <button
                        on
                        onClick={signOut}
                        className="block ml-4 font-semibold text-gray-900"
                      >
                        Sign out
                        <span className="absolute inset-0 top-5">
                          <IoIosLogOut className="text-xl " />
                        </span>
                      </button>
                    </div>
                  </div>
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
          className="hidden lg:flex lg:flex-1 lg:justify-end"
          role="dialog"
          aria-modal="true"
        >
          <NavLink
            to="/login"
            className="text-sm flex    items-center justify-items-center font-semibold leading-6 text-gray-900   hover:bg-fuchsia-200  hover:font-bold py-2 px-4 rounded-t-2xl"
          >
            <HiOutlineLogin className="mt-1 text-xl pl-1" />
            سلة
          </NavLink>
          <NavLink
            to="/login"
            className="text-sm flex    items-center justify-items-center font-semibold leading-6 text-gray-900   hover:bg-fuchsia-200  hover:font-bold py-2 px-4 rounded-t-2xl"
          >
            <HiOutlineLogin className="mt-1 text-xl pl-1" />
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
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
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
                  to="/profile"
                  className={`${activeNavLink({
                    isActive: pathname === "/profile",
                  })} -mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900  hover:bg-fuchsia-200 `}
                  aria-current="page"
                >
                  Profile
                </NavLink>
                <NavLink
                  to="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900  hover:bg-fuchsia-200 "
                >
                  Empte
                </NavLink>
              </div>
              <div className="-mx-3">
                <button
                  type="button"
                  className={`${activeNavLink({
                    isActive: pathname === "/user",
                  })} flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900  hover:bg-fuchsia-200 `}
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
                        className="flex  items-center justify-items-center rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900  hover:bg-fuchsia-200 "
                      >
                        <span className="p-2">
                          <LuLayoutDashboard className="mt-1 text-xl pl-1" />
                        </span>
                        Dashboard
                      </NavLink>
                    )}
                    <button
                      onClick={signOut}
                      className=" flex  items-center justify-items-center  rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900  hover:bg-fuchsia-200 "
                    >
                      <span className="p-2">
                        <IoIosLogOut className="mt-1 text-xl pl-1 " />
                      </span>
                      Sign out
                    </button>
                    <NavLink
                      to="/contactus"
                      className=" flex  items-center justify-items-center  rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900  hover:bg-fuchsia-200 "
                    >
                      <span className="p-2">
                        <HiOutlinePhone className="mt-1 text-xl pl-1  " />
                      </span>
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
