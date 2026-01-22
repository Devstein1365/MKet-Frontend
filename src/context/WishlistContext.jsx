import React, { createContext, useContext, useState, useEffect } from "react";
import wishlistService from "../services/wishlistService";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load wishlist from backend when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [isAuthenticated]);

  const loadWishlist = async () => {
    setLoading(true);
    const result = await wishlistService.getWishlist();
    if (result.success) {
      setWishlistItems(result.wishlist);
    }
    setLoading(false);
  };

  const addToWishlist = async (product) => {
    if (!isAuthenticated) {
      console.error("User must be logged in to add to wishlist");
      return { success: false, message: "Please login to add to wishlist" };
    }

    const result = await wishlistService.addToWishlist(product._id || product.id);
    if (result.success) {
      await loadWishlist(); // Reload wishlist
    }
    return result;
  };

  const removeFromWishlist = async (productId) => {
    if (!isAuthenticated) {
      return { success: false, message: "Please login" };
    }

    const result = await wishlistService.removeFromWishlist(productId);
    if (result.success) {
      await loadWishlist(); // Reload wishlist
    }
    return result;
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(
      (item) => item.product?._id === productId || item.product?.id === productId
    );
  };

  const clearWishlist = async () => {
    if (!isAuthenticated) {
      return { success: false, message: "Please login" };
    }

    const result = await wishlistService.clearWishlist();
    if (result.success) {
      setWishlistItems([]);
    }
    return result;
  };

  const toggleWishlist = async (product) => {
    const productId = product._id || product.id;
    if (isInWishlist(productId)) {
      return removeFromWishlist(productId);
    } else {
      return addToWishlist(product);
    }
  };

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    toggleWishlist,
    loading,
    wishlistCount: wishlistItems.length,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

      addToWishlist(product);
    }
  };

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    toggleWishlist,
    wishlistCount: wishlistItems.length,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
