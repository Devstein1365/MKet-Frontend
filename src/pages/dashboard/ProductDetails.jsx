import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHeart,
  FaRegHeart,
  FaMapMarkerAlt,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
  FaShare,
  FaFlag,
  FaCheckCircle,
  FaClock,
  FaEdit,
} from "react-icons/fa";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/shared/Button";
import Card from "../../components/shared/Card";
import Avatar from "../../components/shared/Avatar";
import Badge from "../../components/shared/Badge";
import Modal from "../../components/shared/Modal";
import productsService from "../../services/productsService";
import reportService from "../../services/reportService";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [submittingReport, setSubmittingReport] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const result = await productsService.getProductById(id);
        if (result.success) {
          setProduct(result.product);
        } else {
          console.error("Failed to fetch product:", result.message);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? (product.images?.length || 1) - 1 : prev - 1,
    );
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === (product.images?.length || 1) - 1 ? 0 : prev + 1,
    );
  };

  // Minimum swipe distance (in px) to trigger image change
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null); // Reset touchEnd
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      // Swipe left - go to next image
      setCurrentImageIndex((prev) =>
        prev === (product.images?.length || 1) - 1 ? 0 : prev + 1,
      );
    }

    if (isRightSwipe) {
      // Swipe right - go to previous image
      setCurrentImageIndex((prev) =>
        prev === 0 ? (product.images?.length || 1) - 1 : prev - 1,
      );
    }
  };

  const handleWishlistToggle = () => {
    if (product) {
      toggleWishlist(product);
    }
  };

  const handleViewProfile = () => {
    if (product?.seller?.id) {
      navigate(`/dashboard/profile/${product.seller.id}`);
    }
  };

  const handleChatWithSeller = () => {
    if (product?.seller?.id) {
      // Navigate to chat page with seller ID and product context
      navigate(`/dashboard/chat`, {
        state: {
          sellerId: product.seller.id,
          sellerName: product.seller.name,
          sellerAvatar: product.seller.avatar,
          productId: product.id,
          productTitle: product.title,
          productImage: product.image,
          productPrice: product.price,
        },
      });
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: product.title,
      text: `Check out this ${product.title} for ₦${parseInt(
        product.price,
      ).toLocaleString()}`,
      url: window.location.href,
    };

    try {
      // Check if Web Share API is supported
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: Copy link to clipboard
        await navigator.clipboard.writeText(window.location.href);
        setShowShareToast(true);
        setTimeout(() => setShowShareToast(false), 3000);
      }
    } catch (error) {
      // User cancelled or error occurred
      if (error.name !== "AbortError") {
        console.error("Error sharing:", error);
        // Fallback: Copy to clipboard
        try {
          await navigator.clipboard.writeText(window.location.href);
          setShowShareToast(true);
          setTimeout(() => setShowShareToast(false), 3000);
        } catch (clipboardError) {
          console.error("Clipboard error:", clipboardError);
        }
      }
    }
  };

  const handleReportSubmit = async () => {
    if (!reportReason.trim()) {
      alert("Please select or enter a report reason.");
      return;
    }

    setSubmittingReport(true);
    try {
      const result = await reportService.reportProduct(
        product.id,
        reportReason,
        reportDescription,
      );

      if (result.success) {
        setShowReportModal(false);
        setReportReason("");
        setReportDescription("");
        alert("Report submitted successfully. We'll review it shortly.");
      } else {
        alert(result.message || "Failed to submit report");
      }
    } catch (error) {
      console.error("Report submission error:", error);
      alert("An error occurred while submitting report");
    } finally {
      setSubmittingReport(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#7E22CE]"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-xl text-gray-600 font-instrument">
          Product not found
        </p>
        <Button onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const images = Array.isArray(product.images)
    ? product.images.map((img) => img.url || img)
    : typeof product.images === "string"
      ? [product.images]
      : product.image
        ? [product.image]
        : [];
  const isWishlisted = isInWishlist(product.id);
  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-[#7E22CE] transition-colors"
            >
              <FaChevronLeft />
              <span className="font-instrument">Back</span>
            </button>
            <div className="flex items-center gap-3">
              {product?.seller?.id === user?.userId && (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigate(`/dashboard/product/edit/${id}`)}
                  className="w-10 h-10 rounded-full bg-[#7E22CE]/10 flex items-center justify-center hover:bg-[#7E22CE]/20 transition-colors"
                  title="Edit Listing"
                >
                  <FaEdit className="text-[#7E22CE]" />
                </motion.button>
              )}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleShare}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                title="Share Listing"
              >
                <FaShare className="text-gray-600" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleWishlistToggle}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                title={
                  isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"
                }
              >
                {isWishlisted ? (
                  <FaHeart className="text-red-500 text-xl" />
                ) : (
                  <FaRegHeart className="text-gray-600 text-xl" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <Card padding="none" className="overflow-hidden">
              <div
                className="relative aspect-4/3 lg:aspect-video bg-gray-100"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                <motion.img
                  key={currentImageIndex}
                  src={images[currentImageIndex]}
                  alt={`${product.title} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover cursor-zoom-in"
                  onClick={() => setIsImageModalOpen(true)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Image Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                    >
                      <FaChevronLeft className="text-gray-800" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                    >
                      <FaChevronRight className="text-gray-800" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-instrument">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.condition && (
                    <Badge
                      variant={
                        product.condition === "New"
                          ? "success"
                          : product.condition === "Fairly Used"
                            ? "warning"
                            : "info"
                      }
                    >
                      {product.condition}
                    </Badge>
                  )}
                  {discount > 0 && <Badge variant="error">-{discount}%</Badge>}
                </div>
              </div>
            </Card>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="overflow-x-auto">
                <div className="flex gap-2 pb-2">
                  {images.map((image, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      whileTap={{ scale: 0.95 }}
                      className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex
                          ? "border-[#7E22CE] ring-2 ring-[#7E22CE]/20"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            {/* Title and Price */}
            <Card>
              <div className="space-y-4">
                <h1 className="text-2xl sm:text-3xl font-inter font-bold text-gray-900">
                  {product.title}
                </h1>

                {/* Price Section */}
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-3xl sm:text-4xl font-inter font-bold text-[#7E22CE]">
                    ₦{parseInt(product.price).toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xl text-gray-400 line-through font-instrument">
                      ₦{parseInt(product.originalPrice).toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Meta Info */}
                <div className="flex items-center gap-4 text-sm text-gray-600 font-instrument">
                  <div className="flex items-center gap-1">
                    <FaMapMarkerAlt className="text-[#14B8A6]" />
                    <span>{product.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaEye />
                    <span>{product.views} views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaClock />
                    <span>{formatDate(product.createdAt)}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Seller Info */}
            <Card>
              <h3 className="text-lg font-inter font-semibold text-gray-900 mb-4">
                Seller Information
              </h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={product.seller.avatarUrl}
                    alt={product.seller.fullName}
                    name={product.seller.fullName}
                    fallbackColor={product.seller.avatarColor}
                    size="lg"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-inter font-semibold text-gray-900">
                        {product.seller.fullName}
                      </h4>
                      {product.seller.isVerified && (
                        <FaCheckCircle className="text-[#10B981] text-sm" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 font-instrument">
                      Member since{" "}
                      {new Date(product.seller.createdAt).getFullYear()}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleViewProfile}>
                  View Profile
                </Button>
              </div>
            </Card>

            {/* Description */}
            <Card>
              <h3 className="text-lg font-inter font-semibold text-gray-900 mb-3">
                Description
              </h3>
              <p className="text-gray-700 font-instrument leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </Card>

            {/* Action Buttons */}
            <Card>
              <div className="space-y-3">
                <Button
                  fullWidth
                  size="lg"
                  className="text-lg"
                  onClick={handleChatWithSeller}
                >
                  Chat with Seller
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => setShowReportModal(true)}
                    disabled={product?.seller?.id === user?.userId}
                  >
                    <FaFlag className="mr-2" />
                    {product?.seller?.id === user?.userId
                      ? "Your Listing"
                      : "Report"}
                  </Button>
                  <Button variant="outline" fullWidth onClick={handleShare}>
                    <FaShare className="mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Image Modal - Full Screen View */}
      <AnimatePresence>
        {isImageModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setIsImageModalOpen(false)}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              ×
            </button>
            <motion.img
              key={currentImageIndex}
              src={images[currentImageIndex]}
              alt={product.title}
              className="max-w-full max-h-full object-contain"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <FaChevronLeft className="text-xl" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <FaChevronRight className="text-xl" />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Toast Notification */}
      <AnimatePresence>
        {showShareToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg z-50 flex items-center gap-2"
          >
            <FaCheckCircle className="text-[#14B8A6]" />
            <span className="font-instrument">Link copied to clipboard!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <Modal
        isOpen={showReportModal}
        onClose={() => {
          if (!submittingReport) setShowReportModal(false);
        }}
        title="Report Listing"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason
            </label>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Select a reason</option>
              <option value="Spam">Spam</option>
              <option value="Scam/Fraud">Scam/Fraud</option>
              <option value="Misleading Description">
                Misleading Description
              </option>
              <option value="Inappropriate Content">
                Inappropriate Content
              </option>
              <option value="Prohibited Item">Prohibited Item</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Details (optional)
            </label>
            <textarea
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none"
              placeholder="Tell us why this listing should be reviewed..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              fullWidth
              onClick={() => setShowReportModal(false)}
              disabled={submittingReport}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              onClick={handleReportSubmit}
              disabled={submittingReport}
            >
              {submittingReport ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProductDetails;
