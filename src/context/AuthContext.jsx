import React, { createContext, useState, useContext, useEffect } from "react";
import authService from "../services/authService";
import chatService from "../services/chatService";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = () => {
      if (authService.isAuthenticated()) {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        // Connect to Socket.io for real-time chat
        chatService.connect();
      }
      setLoading(false);
    };

    checkAuth();

    // Cleanup: Disconnect Socket.io on unmount
    return () => {
      chatService.disconnect();
    };
  }, []);

  // Signup function
  const signup = async (userData) => {
    const result = await authService.signup(userData);
    return result;
  };

  // Login function
  const login = async (email, password) => {
    const result = await authService.login(email, password);
    if (result.success) {
      setUser(result.user);
      // Connect to Socket.io for real-time chat
      chatService.connect();
    }
    return result;
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setUser(null);
    // Disconnect from Socket.io
    chatService.disconnect();
  };

  // Update user profile
  const updateUser = async (updatedData) => {
    const result = await authService.updateCurrentUser(updatedData);
    if (result.success) {
      setUser(result.user);
    }
    return result;
  };

  // Update user settings/preferences
  const updateSettings = async (settingsData) => {
    const result = await authService.updateSettings(settingsData);
    if (result.success) {
      setUser(result.user);
    }
    return result;
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    signup,
    login,
    logout,
    updateUser,
    updateSettings,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
