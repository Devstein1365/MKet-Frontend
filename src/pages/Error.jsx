import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaHome,
  FaArrowLeft,
  FaSearch,
  FaExclamationTriangle,
  FaCompass,
} from "react-icons/fa";
import Button from "../components/shared/Button";
import Logo from "../components/ui/Logo";

const Error = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#7E22CE]/10 via-white to-[#14B8A6]/10 flex flex-col">
      {/* Header with Logo */}
      <div className="p-6">
        <Link to="/">
          <Logo />
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl"
        >
          {/* 404 Animation */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.5,
              type: "spring",
              stiffness: 200,
            }}
            className="mb-8"
          >
            <div className="relative inline-block">
              {/* Large 404 */}
              <h1 className="text-[150px] sm:text-[200px] font-inter font-black text-transparent bg-clip-text bg-gradient-to-r from-[#7E22CE] to-[#14B8A6] leading-none">
                404
              </h1>

              {/* Warning Icon */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-0 right-0 -mt-4 -mr-4"
              >
                <div className="bg-yellow-400 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
                  <FaExclamationTriangle size={28} />
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-inter font-bold text-gray-900 mb-4">
              Oops! Page Not Found
            </h2>
            <p className="text-lg text-gray-600 font-instrument mb-2">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <p className="text-gray-500 font-instrument mb-8 flex items-center justify-center gap-2">
              Don't worry, even the best explorers get lost sometimes!{" "}
              <FaCompass className="inline" />
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              icon={<FaArrowLeft />}
            >
              Go Back
            </Button>

            <Link to="/dashboard">
              <Button icon={<FaHome />}>Go to Dashboard</Button>
            </Link>

            <Link to="/dashboard/search">
              <Button variant="outline" icon={<FaSearch />}>
                Search Products
              </Button>
            </Link>
          </motion.div>

          {/* Helpful Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mt-12 pt-8 border-t border-gray-200"
          >
            <p className="text-sm text-gray-600 font-instrument mb-4">
              Need help? Try these popular pages:
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/dashboard"
                className="text-[#7E22CE] hover:text-[#6B1FB8] font-instrument text-sm hover:underline"
              >
                Home
              </Link>
              <Link
                to="/dashboard/categories"
                className="text-[#7E22CE] hover:text-[#6B1FB8] font-instrument text-sm hover:underline"
              >
                Categories
              </Link>
              <Link
                to="/dashboard/profile"
                className="text-[#7E22CE] hover:text-[#6B1FB8] font-instrument text-sm hover:underline"
              >
                My Profile
              </Link>
              <Link
                to="/dashboard/post"
                className="text-[#7E22CE] hover:text-[#6B1FB8] font-instrument text-sm hover:underline"
              >
                Post Item
              </Link>
              <Link
                to="/dashboard/settings"
                className="text-[#7E22CE] hover:text-[#6B1FB8] font-instrument text-sm hover:underline"
              >
                Settings
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="p-6 text-center">
        <p className="text-sm text-gray-500 font-instrument">
          © 2025 MKET - Student Marketplace
        </p>
      </div>
    </div>
  );
};

export default Error;
