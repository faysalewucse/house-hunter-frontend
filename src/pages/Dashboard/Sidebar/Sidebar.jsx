/* eslint-disable no-unused-vars */
import {
  MdClass,
  MdManageAccounts,
  MdOutlineFlightClass,
  MdSpaceDashboard,
} from "react-icons/md";
import { AiOutlineSetting } from "react-icons/ai";
import { MdOutlineAddHomeWork } from "react-icons/md";
import { BiHelpCircle } from "react-icons/bi";
import { GiNinjaArmor } from "react-icons/gi";
import { FaUserShield } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { BsCreditCard } from "react-icons/bs";
import { SlClose } from "react-icons/sl";
import { useAuth } from "../../../context/AuthContext";
import { useState } from "react";

export const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { currentUser } = useAuth();

  const [user, setUser] = useState(JSON.parse(currentUser));

  const menuItems = [
    {
      route: "Dashboard",
      path: "/dashboard",
      icon: <MdSpaceDashboard />,
      visible: true,
    },
    {
      route: "Manage Houses",
      path: "manage-houses",
      icon: <MdOutlineAddHomeWork />,
      visible: user?.role === "houseOwner",
    },
    {
      route: "Enrolled Classes",
      path: "enrolledClasses",
      icon: <GiNinjaArmor />,
      role: "student",
    },
    {
      route: "Payments",
      path: "payments",
      icon: <BsCreditCard />,
      role: "student",
    },
    {
      route: "Add Class",
      path: "addClass",
      icon: <MdOutlineFlightClass />,
      role: "instructor",
    },
    {
      route: "My Classes",
      path: "classes",
      icon: <MdClass />,
      role: "instructor",
    },
    {
      route: "Manage Classes",
      path: "manageClasses",
      icon: <MdManageAccounts />,
      role: "admin",
    },
    {
      route: "Manage Users",
      path: "manageUsers",
      icon: <FaUserShield />,
      role: "admin",
    },
  ];

  const menuItems2 = [
    {
      route: "Settings",
      path: "/settings",
      icon: <AiOutlineSetting />,
    },
    {
      route: "Get Help",
      path: "/help",
      icon: <BiHelpCircle />,
    },
  ];

  return (
    <div
      className={`min-h-screen md:relative md:left-0 absolute bottom-0 transition-all duration-200 ${
        isSidebarOpen ? "left-0" : "-left-full"
      } lg:block dark:bg-slate-950 w-80 bg-white dark:text-white dark:border-none border-r-[1px]`}
    >
      {/* First Section */}
      <div className="p-10">
        <SlClose
          onClick={() => setIsSidebarOpen(false)}
          className="dark:text-white absolute right-6 top-10 text-3xl z-20 md:hidden"
        />
        <h1 className="flex items-center font-bold text-2xl text-center">
          House Hunter
        </h1>
        <h1 className="mt-10 mb-5">Menu</h1>
        <ul className="flex flex-col gap-7">
          {menuItems.map(
            (item, index) =>
              item.visible && (
                <NavLink
                  key={index}
                  to={item.path}
                  className={({ isActive }) =>
                    isActive
                      ? "text-primary flex gap-3 font-bold items-center"
                      : "flex hover:text-primary hover:font-bold gap-3 items-center transition-all duration-300"
                  }
                >
                  <div className="text-2xl">{item.icon}</div>
                  <h1 className="text-lg">{item.route}</h1>
                </NavLink>
              )
          )}
        </ul>
      </div>
      <hr />
      {/* Third Section */}
      <div className="p-10">
        <ul className="flex flex-col gap-8">
          {menuItems2.map((item, index) => {
            return (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  isActive
                    ? "text-primary flex gap-3 font-bold items-center"
                    : "flex hover:text-primary hover:font-bold gap-3 items-center transition-all duration-300"
                }
              >
                <div className="text-2xl">{item.icon}</div>
                <h1 className="text-lg">{item.route}</h1>
              </NavLink>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
