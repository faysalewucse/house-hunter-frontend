import brand from "/brand.png";
import avatar from "/avatar.png";
import { NavLink } from "react-router-dom";
import { Container } from "../Container";
import { MdOutlineWbSunny } from "react-icons/md";
import { SlClose, SlMenu } from "react-icons/sl";
import { HiMoon } from "react-icons/hi";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

export const Navbar = () => {
  const { currentUser, setCurentUser, open, isOpen, setOpen, setIsOpen } =
    useAuth();

  const { isDark, toggleDarkMode } = useTheme();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const logoutHandler = () => {
    localStorage.removeItem("userEmail");
    setCurentUser(null);
  };

  const navItems = [
    { route: "/", label: "Home", visible: true },
    { route: "/about", label: "About", visible: true },
    {
      route: "/sign-in",
      label: "Login",
      visible: !currentUser ? true : false,
    },
  ];

  const dropdownItems = [
    { route: "/profile", label: "Profile", for: "user" },
    { route: "/my-houses", label: "My Houses", for: "user" },
  ];

  return (
    <div className="border-b-[1px] dark:border-gray-900 p-5 dark:bg-slate-950">
      <Container>
        <div className="flex items-center justify-between">
          <img className="w-12" src={brand} alt="brand" />
          <nav
            className={`flex flex-col md:flex-row md:relative absolute ${
              open ? "top-0 bg-white dark:bg-slate-800" : "-top-full"
            } right-0 md:w-fit w-full gap-5 transition-all duration-300 md:h-0 md:gap-10 sm:py-0 py-20 text-lg items-center z-20`}
          >
            {navItems.map((navItem, index) => (
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "font-semibold text-primary"
                    : `hover:text-primary dark:text-white dark:hover:text-primary ${
                        !navItem.visible && "hidden"
                      }`
                }
                to={navItem.route}
                key={index}
              >
                {navItem.label}
              </NavLink>
            ))}
            <div className="flex items-center gap-8">
              <div
                onClick={toggleDarkMode}
                className="hover:text-primary cursor-pointer transition duration-200"
              >
                {isDark ? (
                  <MdOutlineWbSunny color="white" size={"1.5em"} />
                ) : (
                  <HiMoon size={"1.5em"} />
                )}
              </div>

              {/* Dropdown Avatar */}
              <div className="relative inline-block">
                <button
                  className="flex items-center justify-center rounded-full bg-gray-200 w-10 h-10 border-2 border-primary p-1"
                  onClick={toggleDropdown}
                >
                  <img
                    src={avatar} // Replace with the path to your avatar image
                    alt="Avatar"
                    className={`rounded-full transition-transform object-cover ${
                      isOpen ? "scale-110" : "scale-100"
                    }`}
                  />
                </button>

                {/* Dropdown menu */}
                <div
                  className={`${
                    isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
                  } transition-all duration-300 absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-lg z-10 border border-gray-300`}
                >
                  {/* Menu items */}
                  {dropdownItems.map((item, index) => (
                    <NavLink
                      to={item.route}
                      key={index}
                      className={`block px-4 py-2 hover:text-primary`}
                    >
                      {item.label}
                    </NavLink>
                  ))}
                  <NavLink
                    onClick={logoutHandler}
                    className={`block px-4 py-2 text-red-500 hover:text-red-600`}
                  >
                    Log Out
                  </NavLink>
                </div>
              </div>
            </div>
          </nav>
          <div onClick={() => setOpen(!open)} className="md:hidden text-2xl">
            {open ? (
              <SlClose className="dark:text-white absolute right-6 top-9 text-3xl z-20" />
            ) : (
              <SlMenu className="dark:text-white text-black text-xl" />
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
