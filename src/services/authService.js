import api from "./api";

// Authentication service using backend API
const AUTH_TOKEN_KEY = "mket_auth_token";
const CURRENT_USER_KEY = "mket_current_user";

class AuthService {
  // Get stored token
  getToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }

  // Get current user from localStorage
  getCurrentUser() {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken();
  }

  // Sign up a new user
  async signup(userData) {
    try {
      const response = await api.post("/auth/signup", userData);

      if (response.data.success) {
        // Store token and user data
        localStorage.setItem(AUTH_TOKEN_KEY, response.data.token);
        localStorage.setItem(
          CURRENT_USER_KEY,
          JSON.stringify(response.data.user),
        );

        return {
          success: true,
          message: response.data.message,
          user: response.data.user,
        };
      }

      return {
        success: false,
        message: response.data.message || "Signup failed",
      };
    } catch (error) {
      console.error("Signup error:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Failed to create account. Please try again.",
      };
    }
  }

  // Login user
  async login(email, password) {
    try {
      const response = await api.post("/auth/login", {
        email: email?.trim().toLowerCase(),
        password,
      });

      if (response.data.success) {
        // Store token and user data
        localStorage.setItem(AUTH_TOKEN_KEY, response.data.token);
        localStorage.setItem(
          CURRENT_USER_KEY,
          JSON.stringify(response.data.user),
        );

        return {
          success: true,
          message: response.data.message,
          user: response.data.user,
        };
      }

      return {
        success: false,
        message: response.data.message || "Login failed",
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Invalid email or password",
      };
    }
  }

  // Logout user
  logout() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
  }

  // Get current user profile from backend
  async getProfile() {
    try {
      const response = await api.get("/auth/me");

      if (response.data.success) {
        // Update stored user data
        localStorage.setItem(
          CURRENT_USER_KEY,
          JSON.stringify(response.data.user),
        );
        return {
          success: true,
          user: response.data.user,
        };
      }

      return {
        success: false,
        message: response.data.message || "Failed to get profile",
      };
    } catch (error) {
      console.error("Get profile error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to get profile",
      };
    }
  }

  // Update user profile
  async updateCurrentUser(updatedData) {
    try {
      const response = await api.put("/auth/update", updatedData);

      if (response.data.success) {
        // Update stored user data
        localStorage.setItem(
          CURRENT_USER_KEY,
          JSON.stringify(response.data.user),
        );

        return {
          success: true,
          message: response.data.message,
          user: response.data.user,
        };
      }

      return {
        success: false,
        message: response.data.message || "Update failed",
      };
    } catch (error) {
      console.error("Update profile error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update profile",
      };
    }
  }

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await api.put("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      return {
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Change password error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to change password",
      };
    }
  }

  // Get user by ID (public profile)
  async getUserById(userId) {
    try {
      const response = await api.get(`/auth/user/${userId}`);

      return {
        success: response.data.success,
        user: response.data.user,
      };
    } catch (error) {
      console.error("Get user error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "User not found",
      };
    }
  }
}

export default new AuthService();
