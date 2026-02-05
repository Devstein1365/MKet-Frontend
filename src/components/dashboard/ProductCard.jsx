import React from "react";
import { motion } from "framer-motion";
import {
  FaHeart,
  FaRegHeart,
  FaMapMarkerAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { useWishlist } from "../../context/WishlistContext";
import Card from "../shared/Card";
import Avatar from "../shared/Avatar";

const ProductCard = ({ product, onClick }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  // Get first image from images array
  const imageUrl =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0].url || product.images[0]
      : product.image || "https://via.placeholder.com/400";

  return (
    <Card
      hoverable
      padding="none"
      className="overflow-hidden group"
      onClick={onClick}
    >
      {/* Product image */}
      <div className="p-2">
        <div className="relative aspect-square overflow-hidden bg-gray-100 rounded-lg">
          <img
            src={imageUrl}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />

          {/* Wishlist button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleWishlistToggle}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:shadow-lg transition-all z-10"
          >
            {isWishlisted ? (
              <FaHeart className="text-red-500 text-base" />
            ) : (
              <FaRegHeart className="text-[#4B5563] text-base" />
            )}
          </motion.button>

          {/* Condition badge (top-left) */}
          {product.condition && (
            <div className="absolute top-2 left-2">
              <span className="inline-block px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-800 rounded">
                {product.condition}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Product details */}
      <div className="px-3 pb-3">
        {/* Title */}
        <h3 className="font-inter font-semibold text-[#111827] text-sm mb-1.5 line-clamp-2 group-hover:text-[#7E22CE] transition-colors">
          {product.title}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-lg font-bold text-[#7E22CE] font-inter">
            ₦{product.price?.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-[#9CA3AF] line-through font-instrument">
              ₦{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Location */}
        {product.location && (
          <div className="flex items-center gap-1 text-xs text-[#6B7280] mb-3">
            <FaMapMarkerAlt className="text-[#14B8A6] flex-shrink-0" />
            <span className="font-instrument truncate">{product.location}</span>
          </div>
        )}

        {/* Seller info */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
          <Avatar
            src={product.seller?.avatarUrl}
            alt={product.seller?.fullName}
            name={product.seller?.fullName}
            size="xs"
            fallbackColor={product.seller?.avatarColor}
          />
          <div className="flex-1 min-w-0 flex items-center gap-1">
            <p className="text-xs font-medium text-[#111827] font-inter truncate">
              {product.seller?.fullName}
            </p>
            {product.seller?.isVerified && (
              <FaCheckCircle
                className="text-[#10B981] text-xs flex-shrink-0"
                title="Verified Seller"
              />
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
