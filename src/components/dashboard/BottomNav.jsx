import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHome, FaHeart, FaPlus, FaComments, FaUser } from "react-icons/fa";
import { useWishlist } from "../../context/WishlistContext";
import { useUnreadMessages } from "../../context/UnreadMessagesContext";

const BottomNav = () => {
  const location = useLocation();
  const { wishlistCount } = useWishlist();
  const { unreadCount } = useUnreadMessages();

  const navItems = [
    {
      name: "Home",
      path: "/dashboard",
      icon: FaHome,
    },
    {
      name: "Wishlist",
      path: "/dashboard/wishlist",
      icon: FaHeart,
      badge: wishlistCount,
    },
    {
      name: "Post",
      path: "/dashboard/post",
      icon: FaPlus,
      isSpecial: true, // Center floating button
    },
    {
      name: "Chat",
      path: "/dashboard/chat",
      icon: FaComments,
      badge: unreadCount,
    },
    {
      name: "Profile",
      path: "/dashboard/profile",
      icon: FaUser,
    },
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      {/* Background with blur */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-xl border-t border-gray-200"></div>

      {/* Nav items */}
      <div className="relative flex items-center justify-around h-16 px-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          if (item.isSpecial) {
            return (
              <Link key={item.name} to={item.path} className="relative -mt-8">
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="w-14 h-14 rounded-full bg-gradient-to-br from-[#7E22CE] to-[#14B8A6] shadow-lg flex items-center justify-center"
                >
                  <Icon className="text-white text-xl" />
                </motion.div>
              </Link>
            );
          }

          return (
            <Link
              key={item.name}
              to={item.path}
              className="relative flex flex-col items-center justify-center flex-1 h-full group"
            >
              {/* Active indicator */}
              {active && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-[#7E22CE] to-[#14B8A6] rounded-b-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}

              {/* Icon with badge */}
              <motion.div
                animate={{
                  scale: active ? 1.1 : 1,
                  y: active ? -2 : 0,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative"
              >
                <Icon
                  className={`text-xl transition-colors ${
                    active
                      ? "text-[#7E22CE]"
                      : "text-[#4B5563] group-hover:text-[#7E22CE]"
                  }`}
                />
                {/* Badge count */}
                {item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
              </motion.div>

              {/* Label */}
              <span
                className={`text-xs font-inter mt-1 transition-colors ${
                  active
                    ? "text-[#7E22CE] font-semibold"
                    : "text-[#4B5563] group-hover:text-[#7E22CE]"
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
