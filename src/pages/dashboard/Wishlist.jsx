import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart, FaHome, FaShoppingBag, FaTrash } from "react-icons/fa";
import { useWishlist } from "../../context/WishlistContext";
import ProductCard from "../../components/dashboard/ProductCard";
import Button from "../../components/shared/Button";
import Modal from "../../components/shared/Modal";

const Wishlist = () => {
  const navigate = useNavigate();
  const { wishlistItems, removeFromWishlist, clearWishlist, wishlistCount } =
    useWishlist();

  // Modal state
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "confirm",
    showCancel: false,
    onConfirm: null,
  });

  const showModal = (
    title,
    message,
    type = "confirm",
    showCancel = true,
    onConfirm = null
  ) => {
    setModal({ isOpen: true, title, message, type, showCancel, onConfirm });
  };

  const closeModal = () => {
    setModal({ ...modal, isOpen: false });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
    exit: {
      x: -100,
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-inter font-bold text-[#111827] flex items-center gap-2">
                <FaHeart className="text-red-500" />
                My Wishlist
              </h1>
              <p className="text-sm text-[#4B5563] font-instrument">
                {wishlistCount} {wishlistCount === 1 ? "item" : "items"} saved
              </p>
            </div>

            {wishlistCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                icon={<FaTrash />}
                iconPosition="left"
                onClick={() => {
                  showModal(
                    "Clear Wishlist",
                    "Are you sure you want to clear your entire wishlist?",
                    "confirm",
                    true,
                    () => clearWishlist()
                  );
                }}
              >
                Clear All
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {wishlistCount > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {wishlistItems.map((item) => (
                <motion.div
                  key={item.product?._id || item.product?.id}
                  variants={itemVariants}
                  layout
                  exit="exit"
                >
                  <ProductCard
                    product={item.product}
                    onClick={() =>
                      navigate(
                        `/dashboard/product/${
                          item.product?._id || item.product?.id
                        }`
                      )
                    }
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          // Empty state
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            {/* Empty wishlist illustration */}
            <div className="w-32 h-32 bg-gradient-to-br from-[#7E22CE]/10 to-[#14B8A6]/10 rounded-full flex items-center justify-center mb-6">
              <FaHeart className="text-6xl text-[#4B5563]/30" />
            </div>

            <h2 className="text-2xl font-inter font-bold text-[#111827] mb-2">
              Your Wishlist is Empty
            </h2>
            <p className="text-[#4B5563] font-instrument mb-6 max-w-md">
              Start adding products you love to your wishlist. Click the heart
              icon on any product to save it here.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/dashboard">
                <Button icon={<FaHome />} iconPosition="left" size="lg">
                  Browse Products
                </Button>
              </Link>
              <Link to="/dashboard/post">
                <Button
                  variant="outline"
                  icon={<FaShoppingBag />}
                  iconPosition="left"
                  size="lg"
                >
                  Sell an Item
                </Button>
              </Link>
            </div>

            {/* Tips section */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
              <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
                <div className="w-12 h-12 bg-[#7E22CE]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaHeart className="text-xl text-[#7E22CE]" />
                </div>
                <h3 className="font-inter font-semibold text-[#111827] mb-2">
                  Save Favorites
                </h3>
                <p className="text-sm text-[#4B5563] font-instrument">
                  Keep track of items you're interested in buying later
                </p>
              </div>

              <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
                <div className="w-12 h-12 bg-[#14B8A6]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">🔔</span>
                </div>
                <h3 className="font-inter font-semibold text-[#111827] mb-2">
                  Get Notified
                </h3>
                <p className="text-sm text-[#4B5563] font-instrument">
                  Receive alerts when prices drop on your saved items
                </p>
              </div>

              <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
                <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">⚡</span>
                </div>
                <h3 className="font-inter font-semibold text-[#111827] mb-2">
                  Quick Access
                </h3>
                <p className="text-sm text-[#4B5563] font-instrument">
                  Access your wishlist from any device, anytime
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        showCancel={modal.showCancel}
        onConfirm={modal.onConfirm}
      />
    </div>
  );
};

export default Wishlist;
