import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBell,
  FaLock,
  FaUser,
  FaPalette,
  FaLanguage,
  FaSignOutAlt,
  FaChevronRight,
  FaToggleOn,
  FaToggleOff,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import authService from "../../services/authService";
import Card from "../../components/shared/Card";
import Button from "../../components/shared/Button";
import Modal from "../../components/shared/Modal";

const Settings = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    messages: true,
    updates: false,
  });

  // Change password state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  // Password requirements state
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasUppercase: false,
    hasSymbol: false,
  });

  // Password visibility state
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Modal state
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    showCancel: false,
    onConfirm: null,
  });

  const showModal = (
    title,
    message,
    type = "info",
    showCancel = false,
    onConfirm = null,
  ) => {
    setModal({ isOpen: true, title, message, type, showCancel, onConfirm });
  };

  const closeModal = () => {
    setModal({ ...modal, isOpen: false });
  };

  const handleChangePassword = () => {
    setPasswordError("");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordRequirements({
      minLength: false,
      hasUppercase: false,
      hasSymbol: false,
    });
    setShowPasswords({
      current: false,
      new: false,
      confirm: false,
    });
    setShowPasswordModal(true);
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Update password requirements as user types
  const handleNewPasswordChange = (e) => {
    const password = e.target.value;
    setPasswordData({
      ...passwordData,
      newPassword: password,
    });

    // Check password requirements
    setPasswordRequirements({
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  };

  const handlePasswordSubmit = async () => {
    setPasswordError("");

    // Validation
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setPasswordError("All fields are required");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long!");
      return;
    }

    if (!/[A-Z]/.test(passwordData.newPassword)) {
      setPasswordError("Password must contain at least one uppercase letter!");
      return;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword)) {
      setPasswordError("Password must contain at least one symbol!");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    setChangingPassword(true);
    try {
      const result = await authService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword,
      );

      if (!result.success) {
        setPasswordError(result.message || "Failed to change password");
        return;
      }

      setShowPasswordModal(false);
      showModal(
        "Success",
        result.message || "Password changed successfully!",
        "success",
      );
    } finally {
      setChangingPassword(false);
    }
  };

  const handleLogout = () => {
    showModal(
      "Confirm Logout",
      "Are you sure you want to logout?",
      "confirm",
      true,
      () => {
        logout();
        navigate("/auth", { replace: true });
      },
    );
  };

  const settingsSections = [
    {
      title: "Account",
      items: [
        {
          icon: FaUser,
          label: "Edit Profile",
          description: "Update your personal information",
          action: () => navigate("/dashboard/profile"),
        },
        {
          icon: FaLock,
          label: "Change Password",
          description: "Update your password",
          action: handleChangePassword,
        },
      ],
    },
    {
      title: "Notifications",
      items: [
        {
          icon: FaBell,
          label: "Email Notifications",
          description: "Receive updates via email",
          toggle: true,
          value: notifications.email,
          onChange: () =>
            setNotifications({ ...notifications, email: !notifications.email }),
        },
        {
          icon: FaBell,
          label: "Push Notifications",
          description: "Get push notifications on your device",
          toggle: true,
          value: notifications.push,
          onChange: () =>
            setNotifications({ ...notifications, push: !notifications.push }),
        },
        {
          icon: FaBell,
          label: "Message Notifications",
          description: "Get notified for new messages",
          toggle: true,
          value: notifications.messages,
          onChange: () =>
            setNotifications({
              ...notifications,
              messages: !notifications.messages,
            }),
        },
        {
          icon: FaBell,
          label: "Product Updates",
          description: "Notify me about platform updates",
          toggle: true,
          value: notifications.updates,
          onChange: () =>
            setNotifications({
              ...notifications,
              updates: !notifications.updates,
            }),
        },
      ],
    },
    {
      title: "Preferences",
      items: [
        {
          icon: FaPalette,
          label: "Theme",
          description: "Light / Dark mode (Coming Soon)",
          action: () =>
            showModal("Coming Soon", "Theme options coming soon!", "info"),
        },
        {
          icon: FaLanguage,
          label: "Language",
          description: "English (More languages coming soon)",
          action: () =>
            showModal("Coming Soon", "More languages coming soon!", "info"),
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-inter font-bold text-gray-900">
            Settings
          </h1>
          <p className="text-sm text-gray-600 font-instrument mt-1">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* User Info Card */}
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#7E22CE] to-[#14B8A6] flex items-center justify-center text-white text-2xl font-bold">
              {user?.fullName?.charAt(0) || "U"}
            </div>
            <div className="flex-1">
              <h3 className="font-inter font-semibold text-gray-900">
                {user?.fullName || "User"}
              </h3>
              <p className="text-sm text-gray-600 font-instrument">
                {user?.email || "email@example.com"}
              </p>
            </div>
          </div>
        </Card>

        {/* Settings Sections */}
        {settingsSections.map((section) => (
          <div key={section.title}>
            <h2 className="text-sm font-inter font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">
              {section.title}
            </h2>
            <Card padding="none">
              <div className="divide-y divide-gray-200">
                {section.items.map((item, index) => (
                  <div
                    key={index}
                    onClick={item.toggle ? undefined : item.action}
                    className={`${
                      !item.toggle
                        ? "cursor-pointer hover:bg-gray-50 transition-colors"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-[#7E22CE]">
                          <item.icon className="text-lg" />
                        </div>
                        <div className="flex-1">
                          <p className="font-inter font-medium text-gray-900">
                            {item.label}
                          </p>
                          <p className="text-sm text-gray-600 font-instrument">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      {item.toggle ? (
                        <button
                          onClick={item.onChange}
                          className="text-3xl focus:outline-none"
                        >
                          {item.value ? (
                            <FaToggleOn className="text-[#7E22CE]" />
                          ) : (
                            <FaToggleOff className="text-gray-400" />
                          )}
                        </button>
                      ) : (
                        <FaChevronRight className="text-gray-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        ))}

        {/* Logout Button */}
        <Card>
          <Button
            fullWidth
            variant="outline"
            icon={<FaSignOutAlt />}
            onClick={handleLogout}
            className="text-red-500 border-red-500 hover:bg-red-50"
          >
            Logout
          </Button>
        </Card>

        {/* App Info */}
        <div className="text-center text-sm text-gray-500 font-instrument py-4">
          <p>MKET Student Marketplace</p>
          <p className="mt-1">Version 1.0.0</p>
        </div>
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

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-xl font-inter font-bold text-gray-900 mb-4">
              Change Password
            </h3>

            <div className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-instrument font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg font-instrument focus:outline-none focus:ring-2 focus:ring-[#7E22CE] focus:border-transparent"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("current")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-instrument font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={handleNewPasswordChange}
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg font-instrument focus:outline-none focus:ring-2 focus:ring-[#7E22CE] focus:border-transparent"
                    placeholder="Enter new password (min. 8 characters)"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {/* Password Requirements */}
                {passwordData.newPassword && (
                  <div className="mt-2 space-y-1">
                    {/* Min Length */}
                    <div className="flex items-center gap-2">
                      {passwordRequirements.minLength ? (
                        <FaCheckCircle className="text-green-500 text-xs" />
                      ) : (
                        <FaTimesCircle
                          className={`text-xs ${
                            passwordRequirements.minLength
                              ? "text-green-500"
                              : "text-gray-400"
                          }`}
                        />
                      )}
                      <p
                        className={`text-xs font-instrument ${
                          passwordRequirements.minLength
                            ? "text-green-600"
                            : "text-gray-600"
                        }`}
                      >
                        At least 8 characters
                      </p>
                    </div>

                    {/* Uppercase Letter */}
                    <div className="flex items-center gap-2">
                      {passwordRequirements.hasUppercase ? (
                        <FaCheckCircle className="text-green-500 text-xs" />
                      ) : (
                        <FaTimesCircle
                          className={`text-xs ${
                            passwordRequirements.hasUppercase
                              ? "text-green-500"
                              : "text-gray-400"
                          }`}
                        />
                      )}
                      <p
                        className={`text-xs font-instrument ${
                          passwordRequirements.hasUppercase
                            ? "text-green-600"
                            : "text-gray-600"
                        }`}
                      >
                        One uppercase letter (A-Z)
                      </p>
                    </div>

                    {/* Symbol */}
                    <div className="flex items-center gap-2">
                      {passwordRequirements.hasSymbol ? (
                        <FaCheckCircle className="text-green-500 text-xs" />
                      ) : (
                        <FaTimesCircle
                          className={`text-xs ${
                            passwordRequirements.hasSymbol
                              ? "text-green-500"
                              : "text-gray-400"
                          }`}
                        />
                      )}
                      <p
                        className={`text-xs font-instrument ${
                          passwordRequirements.hasSymbol
                            ? "text-green-600"
                            : "text-gray-600"
                        }`}
                      >
                        One symbol (!@#$%^&*)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-instrument font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg font-instrument focus:outline-none focus:ring-2 focus:ring-[#7E22CE] focus:border-transparent"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {/* Password Match Indicator */}
                {passwordData.confirmPassword && (
                  <div className="flex items-center gap-2 mt-1">
                    {passwordData.newPassword ===
                    passwordData.confirmPassword ? (
                      <>
                        <FaCheckCircle className="text-green-500 text-sm" />
                        <p className="text-xs font-instrument text-green-600">
                          Passwords match
                        </p>
                      </>
                    ) : (
                      <>
                        <FaTimesCircle className="text-red-500 text-sm" />
                        <p className="text-xs font-instrument text-red-600">
                          Passwords do not match
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>

              {passwordError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 font-instrument">
                    {passwordError}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowPasswordModal(false)}
                disabled={changingPassword}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePasswordSubmit}
                disabled={changingPassword}
                className="flex-1"
              >
                {changingPassword ? "Updating..." : "Change Password"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
