import api from "./api";

// Wishlist Service - Connected to Backend API

class WishlistService {
  // Get user's wishlist
  async getWishlist() {
    try {
      const response = await api.get("/wishlist");

      return {
        success: true,
        wishlist: response.data.wishlist,
        count: response.data.count,
      };
    } catch (error) {
      console.error("Get wishlist error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to load wishlist",
        wishlist: [],
      };
    }
  }

  // Add product to wishlist
  async addToWishlist(productId) {
    try {
      const response = await api.post(`/wishlist/${productId}`);

      return {
        success: true,
        message: response.data.message,
        wishlist: response.data.wishlist,
      };
    } catch (error) {
      console.error("Add to wishlist error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to add to wishlist",
      };
    }
  }

  // Remove product from wishlist
  async removeFromWishlist(productId) {
    try {
      const response = await api.delete(`/wishlist/${productId}`);

      return {
        success: true,
        message: response.data.message,
        wishlist: response.data.wishlist,
      };
    } catch (error) {
      console.error("Remove from wishlist error:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to remove from wishlist",
      };
    }
  }

  // Check if product is in wishlist
  async checkWishlist(productId) {
    try {
      const response = await api.get(`/wishlist/check/${productId}`);

      return {
        success: true,
        inWishlist: response.data.inWishlist,
      };
    } catch (error) {
      console.error("Check wishlist error:", error);
      return {
        success: false,
        inWishlist: false,
      };
    }
  }

  // Clear wishlist
  async clearWishlist() {
    try {
      const response = await api.delete("/wishlist");

      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Clear wishlist error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to clear wishlist",
      };
    }
  }

  // Toggle wishlist (add or remove)
  async toggleWishlist(productId) {
    const checkResult = await this.checkWishlist(productId);

    if (checkResult.inWishlist) {
      return this.removeFromWishlist(productId);
    } else {
      return this.addToWishlist(productId);
    }
  }
}

export default new WishlistService();
