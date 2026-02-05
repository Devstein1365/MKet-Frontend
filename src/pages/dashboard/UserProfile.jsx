import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReviewForm from "../../components/profile/ReviewForm";
import ReviewsList from "../../components/profile/ReviewsList";
import authService from "../../services/authService";

import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaClock,
  FaStar,
  FaEnvelope,
} from "react-icons/fa";
import Button from "../../components/shared/Button";
import Card from "../../components/shared/Card";
import Avatar from "../../components/shared/Avatar";
import Badge from "../../components/shared/Badge";
import ProductCard from "../../components/dashboard/ProductCard";
import productsService from "../../services/productsService";

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userProducts, setUserProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("products"); // 'products' or 'reviews'
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  const getCurrentUserName = () => {
    try {
      const nameFromKey = window.localStorage.getItem("currentUserName");
      if (nameFromKey) return nameFromKey;
      const cu = window.localStorage.getItem("mket_current_user");
      if (cu) return JSON.parse(cu).name;
      const svc = authService.getCurrentUser();
      return svc ? svc.name : "Anonymous";
    } catch {
      return "Anonymous";
    }
  };

  const getUserNameById = (id) => {
    try {
      if (!id) return null;
      // check current user
      const cu = window.localStorage.getItem("mket_current_user");
      if (cu) {
        const parsed = JSON.parse(cu);
        if (String(parsed.id) === String(id)) return parsed.name;
      }
      // check users list
      const usersRaw = window.localStorage.getItem("mket_users");
      if (usersRaw) {
        const users = JSON.parse(usersRaw);
        const found = users.find((u) => String(u.id) === String(id));
        if (found) return found.name;
      }
    } catch {
      // ignore
    }
    return null;
  };
  // Read current user synchronously to avoid initial UI flicker
  const [currentUserId, setCurrentUserId] = useState(() => {
    if (typeof window === "undefined") return null;
    // Prefer explicit key used elsewhere; fall back to older/demo keys
    const v1 = window.localStorage.getItem("currentUserId");
    if (v1) return v1;
    try {
      const cu = window.localStorage.getItem("mket_current_user");
      if (cu) return JSON.parse(cu).id;
    } catch {
      // ignore
    }
    const fromAuth = authService.getCurrentUser();
    return fromAuth ? fromAuth.id : null;
  });
  const [canReview, setCanReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [reviewEligibilityChecked, setReviewEligibilityChecked] =
    useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      // Check if user is viewing their own profile and redirect to Profile page
      if (currentUserId && currentUserId.toString() === userId.toString()) {
        navigate("/dashboard/profile", { replace: true });
        return;
      }

      setLoading(true);
      try {
        // Get all products
        const response = await productsService.getAllProducts();
        const allProducts = response.products || [];

        // Find products by this seller and get seller info from first product
        const sellerProducts = allProducts.filter(
          (product) => product.seller.id.toString() === userId.toString(),
        );

        if (sellerProducts.length > 0) {
          // Get seller info from the first product
          const sellerInfo = sellerProducts[0].seller;

          // Build user profile from seller data
          setUser({
            id: sellerInfo.id,
            name: sellerInfo.fullName,
            avatar: sellerInfo.avatarUrl,
            avatarColor: sellerInfo.avatarColor,
            verified: sellerInfo.isVerified || false,
            bio:
              sellerInfo.bio ||
              "Passionate about providing quality products and excellent service!",
            location: sellerInfo.location || "Minna, Niger State",
            memberSince: sellerInfo.createdAt || "2024-01-15",
            responseTime: sellerInfo.responseTime || "Within 2 hours",
            rating: sellerInfo.averageRating || 4.5,
            totalReviews: sellerInfo.totalReviews || 12,
            totalProducts: sellerProducts.length,
            totalSales:
              sellerInfo.totalSold || Math.floor(sellerProducts.length * 2.5),
          });

          setUserProducts(sellerProducts);

          // Generate mock reviews for this seller
          const mockReviews = [
            {
              id: 1,
              reviewer: {
                name: "Ibrahim Musa",
                avatar:
                  "https://api.dicebear.com/7.x/avataaars/svg?seed=Ibrahim",
              },
              rating: 5,
              comment:
                "Excellent seller! Product was exactly as described. Fast response and smooth transaction.",
              productTitle: sellerProducts[0]?.title,
              date: "2024-10-20T14:30:00Z",
            },
            {
              id: 2,
              reviewer: {
                name: "Fatima Abubakar",
                avatar:
                  "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima",
              },
              rating: 4,
              comment:
                "Good seller, product in good condition. Delivery was a bit delayed but overall satisfied.",
              productTitle:
                sellerProducts[1]?.title || sellerProducts[0]?.title,
              date: "2024-10-18T09:15:00Z",
            },
            {
              id: 3,
              reviewer: {
                name: "David Adeyemi",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
              },
              rating: 5,
              comment:
                "Highly recommended! Very professional and trustworthy seller.",
              productTitle: sellerProducts[0]?.title,
              date: "2024-10-15T16:45:00Z",
            },
            {
              id: 4,
              reviewer: {
                name: "Blessing Okon",
                avatar:
                  "https://api.dicebear.com/7.x/avataaars/svg?seed=Blessing",
              },
              rating: 4,
              comment:
                "Nice product, seller was very responsive to my questions. Would buy again.",
              productTitle:
                sellerProducts[2]?.title || sellerProducts[0]?.title,
              date: "2024-10-12T11:20:00Z",
            },
            {
              id: 5,
              reviewer: {
                name: "Emmanuel Okeke",
                avatar:
                  "https://api.dicebear.com/7.x/avataaars/svg?seed=Emmanuel",
              },
              rating: 5,
              comment:
                "Perfect! Everything went smoothly. Great communication and genuine products.",
              productTitle:
                sellerProducts[1]?.title || sellerProducts[0]?.title,
              date: "2024-10-10T08:30:00Z",
            },
          ];
          // load any stored reviews for this seller (persisted by demo flow)
          try {
            const storedKey = `reviews:${sellerInfo.id}`;
            const storedRaw = window.localStorage.getItem(storedKey);
            const stored = storedRaw ? JSON.parse(storedRaw) : [];
            const combined = [...stored, ...mockReviews];
            setReviews(combined);

            // compute aggregated rating
            const sum = combined.reduce((s, r) => s + (r.rating || 0), 0);
            const avg = combined.length
              ? sum / combined.length
              : sellerInfo.averageRating || 0;
            setUser((prev) => ({
              ...(prev || {}),
              rating: Number(avg.toFixed(1)),
              totalReviews: combined.length,
            }));
          } catch (err) {
            setReviews(mockReviews);
          }
        } else {
          // If no products found for this seller, set user to null to show "User not found"
          setUser(null);
          setUserProducts([]);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [userId, currentUserId]);

  // Allow any logged-in user to leave feedback (no transaction check needed)
  useEffect(() => {
    // prefer demo key, then project auth key
    const id =
      window.localStorage.getItem("currentUserId") ||
      (() => {
        try {
          const cu = window.localStorage.getItem("mket_current_user");
          return cu ? JSON.parse(cu).id : null;
        } catch {
          return null;
        }
      })();

    // keep state in sync in case login status changed elsewhere
    if (id !== currentUserId) setCurrentUserId(id);

    if (!id) {
      setCanReview(false);
      setHasReviewed(false);
      setReviewEligibilityChecked(true);
      return;
    }

    try {
      // check if this user already left a review for this seller
      const revKey = `reviews:${userId}`;
      const revRaw = window.localStorage.getItem(revKey);
      const existing = revRaw ? JSON.parse(revRaw) : [];
      const already = existing.some((r) => String(r.authorId) === String(id));
      setHasReviewed(Boolean(already));
      setCanReview(!already);
      setReviewEligibilityChecked(true);
    } catch {
      console.warn("Failed to parse reviews for review eligibility");
      setCanReview(false);
      setReviewEligibilityChecked(true);
    }
  }, [userId, currentUserId]);

  const handleChatWithUser = () => {
    navigate("/dashboard/chat", {
      state: {
        sellerId: user.id,
        sellerName: user.name,
        sellerAvatar: user.avatar,
      },
    });
  };

  // Review submission handler (demo/localStorage)
  const handleSubmitReview = async ({
    rating,
    text,
    authorId,
    targetUserId,
    productTitle,
  }) => {
    try {
      const authorName = getCurrentUserName();
      const now = new Date().toISOString();

      // if editing an existing review (same author), update it
      if (editing && editingReview) {
        const updated = {
          ...editingReview,
          rating,
          text,
          productTitle:
            productTitle || editingReview.productTitle || editingReview.product,
          authorId: authorId || currentUserId || null,
          authorName,
          createdAt: now,
        };

        // update state
        setReviews((prev) =>
          (prev || []).map((r) => (r.id === updated.id ? updated : r)),
        );

        // persist
        const key = `reviews:${targetUserId || user.id}`;
        const raw = window.localStorage.getItem(key);
        const arr = raw ? JSON.parse(raw) : [];
        const newArr = arr.map((r) => (r.id === updated.id ? updated : r));
        window.localStorage.setItem(key, JSON.stringify(newArr));

        // recompute rating summary
        const all = newArr;
        const sum = all.reduce((s, r) => s + (r.rating || 0), 0);
        const avg = all.length ? sum / all.length : 0;
        setUser((prev) => ({
          ...(prev || {}),
          rating: Number(avg.toFixed(1)),
          totalReviews: all.length,
        }));
        setEditing(false);
        setEditingReview(null);
        setHasReviewed(true);
        setCanReview(false);
        return;
      }

      // create new review
      const newReview = {
        id: Date.now(),
        authorId: authorId || currentUserId || null,
        authorName,
        rating,
        text,
        productTitle: productTitle || null,
        createdAt: now,
      };

      // update local state
      setReviews((prev) => [newReview, ...(prev || [])]);

      // persist to localStorage per-seller
      const key = `reviews:${targetUserId || user.id}`;
      const raw = window.localStorage.getItem(key);
      const arr = raw ? JSON.parse(raw) : [];
      arr.unshift(newReview);
      window.localStorage.setItem(key, JSON.stringify(arr));

      // recompute rating summary on user
      const all = [newReview, ...(reviews || [])];
      const sum = all.reduce((s, r) => s + (r.rating || 0), 0);
      const avg = all.length ? sum / all.length : 0;
      setUser((prev) => ({
        ...(prev || {}),
        rating: Number(avg.toFixed(1)),
        totalReviews: all.length,
      }));
      // mark that the current user has reviewed so the form hides immediately
      setHasReviewed(true);
      setCanReview(false);
    } catch (err) {
      console.error("Failed to submit review", err);
      throw err;
    }
  };

  // ensure we read any stored reviews for this seller even if there are no products
  useEffect(() => {
    try {
      const key = `reviews:${userId}`;
      const raw = window.localStorage.getItem(key);
      const stored = raw ? JSON.parse(raw) : [];
      if (stored && stored.length > 0) {
        // merge with existing reviews while avoiding duplicates
        setReviews((prev = []) => {
          const map = new Map();
          (stored || []).concat(prev || []).forEach((r) => map.set(r.id, r));
          return Array.from(map.values()).sort((a, b) => b.id - a.id);
        });

        // recompute rating summary
        const all = stored;
        const sum = all.reduce((s, r) => s + (r.rating || 0), 0);
        const avg = all.length ? sum / all.length : 0;
        setUser((prev) => ({
          ...(prev || {}),
          rating: Number(avg.toFixed(1)),
          totalReviews: all.length,
        }));
      }
    } catch {
      // ignore
    }
  }, [userId]);

  const formatMemberSince = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 font-instrument mb-4">
            User not found
          </p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-[#7E22CE] transition-colors"
          >
            <FaArrowLeft />
            <span className="font-instrument">Back</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - User Info */}
          <div className="lg:col-span-1 space-y-4">
            {/* Profile Card */}
            <Card>
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <Avatar
                    src={user.avatar}
                    alt={user.name}
                    name={user.name}
                    fallbackColor={user.avatarColor}
                    size="2xl"
                  />
                  {user.verified && (
                    <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#10B981] rounded-full flex items-center justify-center border-4 border-white">
                      <FaCheckCircle className="text-white text-sm" />
                    </div>
                  )}
                </div>
                <h1 className="text-2xl font-inter font-bold text-gray-900 mb-1">
                  {user.name}
                </h1>
                {user.verified && (
                  <Badge variant="success" className="mb-3">
                    Verified Seller
                  </Badge>
                )}
                <p className="text-gray-600 font-instrument text-sm mb-4">
                  {user.bio}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-2xl font-inter font-bold text-[#7E22CE]">
                      {user.totalProducts}
                    </p>
                    <p className="text-xs text-gray-600 font-instrument">
                      Products
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-inter font-bold text-[#7E22CE]">
                      {user.totalSales}
                    </p>
                    <p className="text-xs text-gray-600 font-instrument">
                      Sales
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-inter font-bold text-[#7E22CE]">
                      {user.rating}
                    </p>
                    <p className="text-xs text-gray-600 font-instrument">
                      Rating
                    </p>
                  </div>
                </div>

                <Button fullWidth onClick={handleChatWithUser}>
                  <FaEnvelope className="mr-2" />
                  Send Message
                </Button>
              </div>
            </Card>

            {/* Info Card */}
            <Card>
              <h3 className="text-lg font-inter font-semibold text-gray-900 mb-4">
                Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-[#14B8A6] mt-1" />
                  <div>
                    <p className="text-sm font-inter font-semibold text-gray-900">
                      Location
                    </p>
                    <p className="text-sm text-gray-600 font-instrument">
                      {user.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaClock className="text-[#14B8A6] mt-1" />
                  <div>
                    <p className="text-sm font-inter font-semibold text-gray-900">
                      Member Since
                    </p>
                    <p className="text-sm text-gray-600 font-instrument">
                      {formatMemberSince(user.memberSince)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaStar className="text-[#14B8A6] mt-1" />
                  <div>
                    <p className="text-sm font-inter font-semibold text-gray-900">
                      Response Time
                    </p>
                    <p className="text-sm text-gray-600 font-instrument">
                      {user.responseTime}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaStar className="text-yellow-500 mt-1" />
                  <div>
                    <p className="text-sm font-inter font-semibold text-gray-900">
                      Rating
                    </p>
                    <p className="text-sm text-gray-600 font-instrument">
                      {user.rating} out of 5 ({user.totalReviews} reviews)
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Products & Reviews */}
          <div className="lg:col-span-2 space-y-4">
            {/* Tabs */}
            <Card>
              <div className="flex gap-4 border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("products")}
                  className={`pb-3 px-1 font-inter font-semibold transition-colors relative ${
                    activeTab === "products"
                      ? "text-[#7E22CE]"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Products ({user.totalProducts})
                  {activeTab === "products" && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7E22CE]"
                    />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`pb-3 px-1 font-inter font-semibold transition-colors relative ${
                    activeTab === "reviews"
                      ? "text-[#7E22CE]"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Reviews ({user.totalReviews})
                  {activeTab === "reviews" && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7E22CE]"
                    />
                  )}
                </button>
              </div>
            </Card>

            {/* Content */}
            {activeTab === "products" ? (
              <div>
                {userProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {userProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onClick={() =>
                          navigate(`/dashboard/product/${product.id}`)
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <div className="text-center py-12">
                      <p className="text-gray-600 font-instrument">
                        No products available
                      </p>
                    </div>
                  </Card>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Review input area: only show to eligible buyers */}
                <Card>
                  {!reviewEligibilityChecked ? (
                    <div className="p-4 text-sm text-gray-700">
                      Checking eligibility…
                    </div>
                  ) : editing && editingReview ? (
                    // Editing takes precedence — show edit form regardless
                    <ReviewForm
                      targetUserId={user.id}
                      authorId={currentUserId}
                      initialRating={editingReview.rating}
                      initialText={editingReview.text}
                      initialProductTitle={
                        editingReview.productTitle || editingReview.product
                      }
                      products={userProducts}
                      submitLabel="Update Review"
                      onCancel={() => {
                        setEditing(false);
                        setEditingReview(null);
                      }}
                      onSubmit={handleSubmitReview}
                    />
                  ) : currentUserId ? (
                    hasReviewed ? (
                      // show the user's own review with an edit button
                      (() => {
                        const my = reviews.find(
                          (r) => String(r.authorId) === String(currentUserId),
                        );
                        if (!my) {
                          return (
                            <div className="p-4 text-sm text-gray-700">
                              You have already left a review for this seller.
                              Thank you!
                            </div>
                          );
                        }
                        return (
                          <Card>
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-3">
                                <Avatar
                                  src={my.reviewer?.avatar || null}
                                  alt={my.authorName}
                                  size="md"
                                />
                                <div>
                                  <div className="font-inter font-semibold">
                                    {my.authorName ||
                                      getUserNameById(my.authorId) ||
                                      "Anonymous"}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {new Date(
                                      my.createdAt || my.date,
                                    ).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <FaStar
                                      key={i}
                                      className={`text-sm ${
                                        i < (my.rating || 0)
                                          ? "text-yellow-500"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <button
                                  className="px-3 py-1 text-sm border rounded bg-white"
                                  onClick={() => {
                                    setEditing(true);
                                    setEditingReview(my);
                                  }}
                                >
                                  Edit
                                </button>
                              </div>
                            </div>
                            <div className="mt-3 text-gray-700">
                              {my.text || my.comment}
                            </div>
                          </Card>
                        );
                      })()
                    ) : canReview ? (
                      <ReviewForm
                        targetUserId={user.id}
                        authorId={currentUserId}
                        products={userProducts}
                        onSubmit={handleSubmitReview}
                      />
                    ) : (
                      <div className="p-4 text-sm text-gray-700">
                        {/* no message for anonymous viewers */}
                      </div>
                    )
                  ) : (
                    <></>
                  )}
                </Card>

                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <Card key={review.id}>
                      <div className="flex gap-4">
                        {/* Reviewer Avatar, use available avatar or initials */}
                        <div className="shrink-0">
                          <Avatar
                            src={review.reviewer?.avatar || null}
                            alt={review.reviewer?.name || review.authorName}
                            size="md"
                          />
                        </div>

                        {/* Review Content */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-inter font-semibold text-gray-900">
                                {review.reviewer?.name ||
                                  review.authorName ||
                                  "Anonymous"}
                              </h4>
                              <p className="text-xs text-gray-500 font-instrument">
                                {new Date(
                                  review.createdAt || review.date,
                                ).toLocaleDateString("en-US", {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                            {/* Star Rating */}
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <FaStar
                                  key={i}
                                  className={`text-sm ${
                                    i < (review.rating || 0)
                                      ? "text-yellow-500"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>

                          {/* Review Text */}
                          <p className="text-gray-700 font-instrument text-sm mb-2">
                            {review.text || review.comment}
                          </p>

                          {/* Product Reference */}
                          {(review.productTitle || review.product) && (
                            <div className="mt-2 pt-2 border-t border-gray-100">
                              <p className="text-xs text-gray-500 font-instrument">
                                Product:{" "}
                                <span className="text-gray-700">
                                  {review.productTitle || review.product}
                                </span>
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <div className="text-center py-12">
                      <FaStar className="text-gray-300 text-4xl mx-auto mb-3" />
                      <p className="text-gray-600 font-instrument mb-2">
                        No reviews yet
                      </p>
                      <p className="text-sm text-gray-500 font-instrument">
                        This seller hasn't received any reviews yet.
                      </p>
                    </div>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
