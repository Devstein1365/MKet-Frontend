import api from "./api";
import {
  FaMobileAlt,
  FaCouch,
  FaBook,
  FaTshirt,
  FaFootballBall,
  FaSpa,
  FaUtensils,
  FaTools,
  FaCar,
  FaHome,
  FaBox,
} from "react-icons/fa";

// Products Service - Connected to Backend API

// Export categories (keep this for UI dropdowns)
export const categories = [
  { id: "electronics", name: "Electronics", icon: FaMobileAlt },
  { id: "fashion", name: "Fashion", icon: FaTshirt },
  { id: "books", name: "Books", icon: FaBook },
  { id: "furniture", name: "Furniture", icon: FaCouch },
  { id: "sports", name: "Sports", icon: FaFootballBall },
  { id: "beauty", name: "Beauty", icon: FaSpa },
  { id: "food", name: "Food", icon: FaUtensils },
  { id: "services", name: "Services", icon: FaTools },
  { id: "vehicles", name: "Vehicles", icon: FaCar },
  { id: "real-estate", name: "Real Estate", icon: FaHome },
  { id: "other", name: "Other", icon: FaBox },
];

class ProductsService {
  // Get all products with filters
  async getAllProducts(filters = {}) {
    try {
      const params = new URLSearchParams();

      if (filters.category) params.append("category", filters.category);
      if (filters.condition) params.append("condition", filters.condition);
      if (filters.minPrice) params.append("minPrice", filters.minPrice);
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
      if (filters.location) params.append("location", filters.location);
      if (filters.search) params.append("search", filters.search);
      if (filters.sort) params.append("sort", filters.sort);
      if (filters.page) params.append("page", filters.page);
      if (filters.limit) params.append("limit", filters.limit);
      if (filters.status && filters.status !== "all") {
        params.append("status", filters.status);
      }

      const response = await api.get(`/products?${params.toString()}`);

      return {
        success: true,
        products: response.data.products,
        pagination: response.data.pagination,
      };
    } catch (error) {
      console.error("Get products error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to load products",
        products: [],
      };
    }
  }

  // Get product by ID
  async getProductById(id) {
    try {
      const response = await api.get(`/products/${id}`);

      return {
        success: true,
        product: response.data.product,
      };
    } catch (error) {
      console.error("Get product error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Product not found",
      };
    }
  }

  // Create new product
  async createProduct(productData) {
    try {
      const response = await api.post("/products", productData);

      return {
        success: true,
        message: response.data.message,
        product: response.data.product,
      };
    } catch (error) {
      console.error("Create product error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to create product",
      };
    }
  }

  // Update product
  async updateProduct(id, productData) {
    try {
      const response = await api.put(`/products/${id}`, productData);

      return {
        success: true,
        message: response.data.message,
        product: response.data.product,
      };
    } catch (error) {
      console.error("Update product error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update product",
      };
    }
  }

  // Delete product
  async deleteProduct(id) {
    try {
      const response = await api.delete(`/products/${id}`);

      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Delete product error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete product",
      };
    }
  }

  // Get user's products
  async getUserProducts(userId, status = "available") {
    try {
      const response = await api.get(
        `/products/user/${userId}?status=${status}`,
      );

      return {
        success: true,
        products: response.data.products,
      };
    } catch (error) {
      console.error("Get user products error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to load products",
        products: [],
      };
    }
  }

  // Add review to product
  async addReview(productId, reviewData) {
    try {
      const response = await api.post(
        `/products/${productId}/reviews`,
        reviewData,
      );

      return {
        success: true,
        message: response.data.message,
        product: response.data.product,
      };
    } catch (error) {
      console.error("Add review error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to add review",
      };
    }
  }

  // Mark product as sold
  async markAsSold(productId) {
    try {
      const response = await api.put(`/products/${productId}/mark-sold`);

      return {
        success: true,
        message: response.data.message,
        product: response.data.product,
      };
    } catch (error) {
      console.error("Mark as sold error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update product",
      };
    }
  }

  // Get my products (listings) - Authenticated user only
  async getMyProducts(status = "all") {
    try {
      const params = status !== "all" ? `?status=${status}` : "";
      const response = await api.get(`/products/my-products${params}`);

      return {
        success: true,
        products: response.data.products,
        count: response.data.count,
      };
    } catch (error) {
      console.error("Get my products error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to load products",
        products: [],
      };
    }
  }

  // Get my drafts - Authenticated user only
  async getMyDrafts() {
    try {
      const response = await api.get("/products/my-products?status=draft");

      return {
        success: true,
        drafts: response.data.products || [],
        count: response.data.count,
      };
    } catch (error) {
      console.error("Get my drafts error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to load drafts",
        drafts: [],
      };
    }
  }

  // Publish draft
  async publishDraft(productId) {
    try {
      const response = await api.put(`/products/${productId}`, {
        status: "AVAILABLE",
      });

      return {
        success: true,
        message: response.data.message,
        product: response.data.product,
      };
    } catch (error) {
      console.error("Publish draft error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to publish product",
      };
    }
  }

  // Get products by category (dedicated endpoint)
  async getProductsByCategory(category, page = 1, limit = 20, sort = "newest") {
    try {
      const response = await api.get(
        `/products?category=${encodeURIComponent(
          category,
        )}&page=${page}&limit=${limit}&sort=${sort}`,
      );

      return {
        success: true,
        products: response.data.products,
        pagination: response.data.pagination,
      };
    } catch (error) {
      console.error("Get products by category error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to load products",
        products: [],
      };
    }
  }

  // Search products (dedicated search endpoint)
  async searchProducts(searchTerm, filters = {}, page = 1, limit = 20) {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (page) params.append("page", page);
      if (limit) params.append("limit", limit);

      // Add other filters if they are not the default "all"
      if (filters.category && filters.category !== "all") {
        params.append("category", filters.category);
      }
      if (filters.condition && filters.condition !== "all") {
        params.append("condition", filters.condition);
      }
      if (filters.minPrice) {
        params.append("minPrice", filters.minPrice);
      }
      if (filters.maxPrice) {
        params.append("maxPrice", filters.maxPrice);
      }
      if (filters.location && filters.location !== "all") {
        params.append("location", filters.location);
      }
      if (filters.sort && filters.sort !== "relevance") {
        params.append("sort", filters.sort);
      }
      if (filters.status && filters.status !== "all") {
        params.append("status", filters.status);
      }

      const response = await api.get(`/products?${params.toString()}`);

      return {
        success: true,
        products: response.data.products,
        query: searchTerm,
        pagination: response.data.pagination,
      };
    } catch (error) {
      console.error("Search products error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Search failed",
        products: [],
      };
    }
  }

  // Get category name by ID
  getCategoryById(categoryId) {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown";
  }

  // Get category icon by ID
  getCategoryIcon(categoryId) {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.icon : FaBox;
  }
}

export default new ProductsService();
