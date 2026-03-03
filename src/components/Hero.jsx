import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaBook,
  FaGraduationCap,
  FaLaptop,
  FaMobileAlt,
  FaCalculator,
  FaCoffee,
  FaPencilAlt,
  FaHeadphones,
  FaBicycle,
  FaTshirt,
  FaCamera,
} from "react-icons/fa";
import { BiSolidBackpack } from "react-icons/bi";

const Hero = () => {
  // Floating icon configuration - spread throughout hero section
  const floatingIcons = [
    // Top left area
    {
      Icon: FaBook,
      delay: 0,
      x: "12%",
      y: "19%",
      duration: 20,
      color: "#7E22CE",
    },
    {
      Icon: FaGraduationCap,
      delay: 2,
      x: "20%",
      y: "28%",
      duration: 25,
      color: "#14B8A6",
    },
    // Top right area
    {
      Icon: FaLaptop,
      delay: 1,
      x: "78%",
      y: "20%",
      duration: 22,
      color: "#7E22CE",
    },
    {
      Icon: FaPencilAlt,
      delay: 3.5,
      x: "56%",
      y: "32%",
      duration: 19,
      color: "#14B8A6",
    },
    // Middle left
    {
      Icon: FaMobileAlt,
      delay: 1.5,
      x: "8%",
      y: "48%",
      duration: 23,
      color: "#7E22CE",
    },
    {
      Icon: BiSolidBackpack,
      delay: 2.8,
      x: "25%",
      y: "50%",
      duration: 24,
      color: "#14B8A6",
    },
    // Middle right
    {
      Icon: FaCalculator,
      delay: 2.5,
      x: "82%",
      y: "52%",
      duration: 21,
      color: "#14B8A6",
    },
    {
      Icon: FaHeadphones,
      delay: 1.8,
      x: "88%",
      y: "64%",
      duration: 24,
      color: "#7E22CE",
    },
    // Bottom left
    {
      Icon: FaCoffee,
      delay: 0.5,
      x: "10%",
      y: "60%",
      duration: 26,
      color: "#7E22CE",
    },
    {
      Icon: FaCamera,
      delay: 3.2,
      x: "25%",
      y: "65%",
      duration: 23,
      color: "#14B8A6",
    },
    // Bottom right
    {
      Icon: FaBicycle,
      delay: 2.8,
      x: "75%",
      y: "68%",
      duration: 22,
      color: "#14B8A6",
    },
    {
      Icon: FaTshirt,
      delay: 0.8,
      x: "82%",
      y: "68%",
      duration: 25,
      color: "#7E22CE",
    },
    // Top center
    {
      Icon: FaBook,
      delay: 1.2,
      x: "48%",
      y: "12%",
      duration: 21,
      color: "#14B8A6",
    },
    // Bottom center
    {
      Icon: FaGraduationCap,
      delay: 2.7,
      x: "52%",
      y: "42%",
      duration: 24,
      color: "#7E22CE",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#FFFFFF] pt-20 pb-32 md:pt-24 md:pb-40">
      {/* Gradient Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.1 }}
          transition={{ duration: 2, delay: 0.3 }}
          className="absolute top-20 -left-20 w-96 h-96 rounded-full"
          style={{ background: "linear-gradient(135deg, #7E22CE, #14B8A6)" }}
        />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.08 }}
          transition={{ duration: 2, delay: 0.6 }}
          className="absolute bottom-32 -right-20 w-[500px] h-[500px] rounded-full"
          style={{ background: "linear-gradient(225deg, #14B8A6, #7E22CE)" }}
        />

        {/* Floating Background Icons */}
        {floatingIcons.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.2, 0.3, 0.2],
              scale: [1, 1.1, 1],
              y: [0, -20, 0],
            }}
            transition={{
              duration: item.duration,
              delay: item.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute md:hidden"
            style={{
              left: item.x,
              top: item.y,
            }}
          >
            <item.Icon
              className="text-3xl sm:text-4xl md:text-5xl"
              style={{ color: item.color, opacity: 0.9 }}
            />
          </motion.div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center md:text-left relative z-10"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-block mb-4 px-4 py-2 bg-[#7E22CE]/10 rounded-full"
            >
              <span className="text-[#7E22CE] font-semibold text-sm font-inter flex items-center gap-2">
                <FaGraduationCap className="text-lg" />
                Built for Students, By Students
              </span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#111827] leading-tight mb-6 font-inter">
              Buy & Sell on Campus.
              <br />
              <span className="bg-linear-to-r from-[#7E22CE] to-[#14B8A6] text-transparent bg-clip-text">
                Fast. Safe. Simple.
              </span>
            </h1>

            <p className="mt-6 text-lg text-[#4B5563] max-w-lg mx-auto md:mx-0 leading-relaxed font-instrument">
              The only verified student marketplace for buying, selling, and
              trading items on campus.
              <span className="font-semibold text-[#7E22CE]">
                {" "}
                No scams. No strangers. Just your campus community.
              </span>
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/auth">
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(126, 34, 206, 0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center bg-linear-to-r from-[#7E22CE] to-[#14B8A6] text-white font-bold text-lg px-8 py-4 rounded-full shadow-xl transition-all duration-300"
                >
                  Get Started Free
                  <svg
                    className="ml-2 w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </motion.button>
              </Link>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  document
                    .getElementById("why-choose-us")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center justify-center bg-white border-2 border-[#7E22CE] text-[#7E22CE] font-semibold text-lg px-8 py-4 rounded-full hover:bg-[#7E22CE]/5 transition-all duration-300"
              >
                Learn More
              </motion.button>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 text-sm text-[#4B5563] flex items-center justify-center md:justify-start gap-2"
            >
              <svg
                className="w-5 h-5 text-[#14B8A6]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Free forever • No hidden fees • Verified students only
            </motion.p>
          </motion.div>

          {/* Right: Phone Mockup - Hidden on mobile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="relative hidden md:flex justify-center md:justify-end"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              {/* Phone Frame */}
              <div className="relative w-72 h-[600px] bg-[#111827] rounded-[3rem] shadow-2xl overflow-hidden border-[14px] border-[#111827]">
                {/* Screen */}
                <div className="absolute inset-0 bg-white rounded-[2rem] overflow-hidden">
                  {/* Status Bar */}
                  <div className="flex items-center justify-between px-6 py-3 bg-[#7E22CE]">
                    <span className="text-xs font-bold text-white font-zen">
                      MKET
                    </span>
                    <div className="text-xs text-white">9:41 AM</div>
                  </div>

                  {/* App Content */}
                  <div className="p-4 space-y-4">
                    {/* Search Bar */}
                    <div className="bg-gray-100 rounded-full px-4 py-2.5 flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <span className="text-sm text-gray-400">
                        Search products...
                      </span>
                    </div>

                    {/* Featured Product Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="bg-gradient-to-br from-[#7E22CE]/10 to-[#14B8A6]/10 rounded-2xl p-4 shadow-lg"
                    >
                      <div className="flex gap-3">
                        <div className="w-20 h-20 bg-[#7E22CE]/20 rounded-xl flex items-center justify-center">
                          <svg
                            className="w-10 h-10 text-[#7E22CE]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-sm text-[#111827]">
                            Engineering Textbook
                          </h3>
                          <p className="text-xs text-[#4B5563]">
                            Like New • Main Campus
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-lg font-bold text-[#7E22CE]">
                              ₦3,500
                            </span>
                            <span className="text-xs px-2 py-1 bg-[#14B8A6] text-white rounded-full">
                              Available
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Chat Preview */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.2 }}
                      className="bg-[#7E22CE] text-white px-4 py-3 rounded-2xl rounded-tl-none shadow-lg"
                    >
                      <p className="text-sm font-medium">
                        Hey! Is this available?
                      </p>
                      <p className="text-xs opacity-80 mt-1">Just now</p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.4 }}
                      className="bg-gray-100 px-4 py-3 rounded-2xl rounded-tr-none shadow-lg ml-8"
                    >
                      <p className="text-sm font-medium text-[#111827]">
                        Yes! Meet at library?
                      </p>
                      <p className="text-xs text-[#4B5563] mt-1">Just now</p>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-linear-to-r from-[#7E22CE] to-[#14B8A6] opacity-20 blur-3xl -z-10"></div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Wave Bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 120L60 105C120 90 240 60 360 50C480 40 600 50 720 60C840 70 960 80 1080 75C1200 70 1320 50 1380 40L1440 30V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="#F3F4F6"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
