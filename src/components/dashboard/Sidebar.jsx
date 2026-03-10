import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHome,
  FaHeart,
  FaComments,
  FaUser,
  FaCog,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import Logo from "../ui/Logo";
import Avatar from "../shared/Avatar";

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(true); // Start collapsed by default

  const menuItems = [
    { name: "Home", path: "/dashboard", icon: FaHome },
    { name: "Wishlist", path: "/dashboard/wishlist", icon: FaHeart },
    { name: "Messages", path: "/dashboard/chat", icon: FaComments },
    { name: "Profile", path: "/dashboard/profile", icon: FaUser },
  ];

  const bottomItems = [
    { name: "Settings", path: "/dashboard/settings", icon: FaCog },
  ];

  const isActive = (path) => {
    if (path === "/dashboard") {
      return (
        location.pathname === "/dashboard" ||
        location.pathname === "/dashboard/"
      );
    }
    return location.pathname.startsWith(path);
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? "5rem" : "16rem" }}
      className="hidden lg:flex flex-col h-screen bg-white border-r border-gray-200 sticky top-0 z-40"
    >
      {/* Header with logo and collapse button */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Logo />
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-[#4B5563]"
        >
          {isCollapsed ? <FaBars /> : <FaTimes />}
        </button>
      </div>

      {/* User profile section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Avatar
            src={user?.avatarUrl}
            alt={user?.fullName}
            size="md"
            status="online"
          />
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex-1 min-w-0"
              >
                <p className="font-inter font-semibold text-[#111827] text-sm truncate">
                  {user?.fullName}
                </p>
                <p className="font-instrument text-xs text-[#4B5563] truncate">
                  {user?.email}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`
                  flex items-center gap-3 px-3 py-3 rounded-lg transition-all relative group
                  ${
                    active
                      ? "bg-gradient-to-r from-[#7E22CE]/10 to-[#14B8A6]/10 text-[#7E22CE]"
                      : "text-[#4B5563] hover:bg-gray-100"
                  }
                `}
              >
                {/* Active indicator */}
                {active && (
                  <motion.div
                    layoutId="sidebarIndicator"
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[#7E22CE] to-[#14B8A6] rounded-r-full"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}

                <Icon
                  className={`text-xl ${
                    active
                      ? "text-[#7E22CE]"
                      : "text-[#4B5563] group-hover:text-[#7E22CE]"
                  }`}
                />

                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className={`font-inter font-medium ${
                        active ? "text-[#7E22CE]" : "text-[#111827]"
                      }`}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom items */}
      <div className="border-t border-gray-200 p-2 space-y-1">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`
                flex items-center gap-3 px-3 py-3 rounded-lg transition-all group
                ${
                  active
                    ? "bg-gray-100 text-[#7E22CE]"
                    : "text-[#4B5563] hover:bg-gray-100"
                }
              `}
            >
              <Icon className="text-xl" />
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="font-inter font-medium"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </div>
    </motion.aside>
  );
};

export default Sidebar;
