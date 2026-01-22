import api from "./api";

// Products Service - Connected to Backend API

// Export categories (keep this for UI dropdowns)
export const categories = [
  { id: "electronics", name: "Electronics", icon: "📱" },
  { id: "fashion", name: "Fashion", icon: "👕" },
  { id: "books", name: "Books", icon: "📚" },
  { id: "furniture", name: "Furniture", icon: "🛋️" },
  { id: "sports", name: "Sports", icon: "⚽" },
  { id: "beauty", name: "Beauty", icon: "💄" },
  { id: "food", name: "Food", icon: "🍔" },
  { id: "services", name: "Services", icon: "🔧" },
  { id: "vehicles", name: "Vehicles", icon: "🚗" },
  { id: "real-estate", name: "Real Estate", icon: "🏠" },
  { id: "other", name: "Other", icon: "📦" },
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
      const response = await api.get(`/products/user/${userId}?status=${status}`);
      
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
      const response = await api.post(`/products/${productId}/reviews`, reviewData);
      
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
      const response = await api.put(`/products/${productId}/sold`);
      
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

  // Get products by category
  async getProductsByCategory(category, page = 1, limit = 20) {
    return this.getAllProducts({ category, page, limit });
  }

  // Search products
  async searchProducts(searchTerm, page = 1, limit = 20) {
    return this.getAllProducts({ search: searchTerm, page, limit });
  }

  // Get category name by ID
  getCategoryById(categoryId) {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown";
  }

  // Get category icon by ID
  getCategoryIcon(categoryId) {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.icon : "📦";
  }
}

export default new ProductsService();
