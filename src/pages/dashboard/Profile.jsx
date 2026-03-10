import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBox, FaEye, FaShoppingBag, FaCog } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/shared/Button";
import Card from "../../components/shared/Card";
import Modal from "../../components/shared/Modal";
import ProfileHeader from "../../components/profile/ProfileHeader";
import ContactInfo from "../../components/profile/ContactInfo";
import StatsCard from "../../components/profile/StatsCard";
import ListingsTab from "../../components/profile/ListingsTab";
import PerformanceStats from "../../components/profile/PerformanceStats";
import ImageCropper from "../../components/shared/ImageCropper";
import productsService from "../../services/productsService";

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState("listings");
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: user?.location || "",
    bio: user?.bio || "",
    avatar: user?.avatarUrl || null,
    verified: user?.isVerified || false,
    joinedDate: user?.createdAt || new Date().toISOString(),
  });

  const [stats, setStats] = useState({
    totalListings: 0,
    totalViews: 0,
    totalSold: 0,
    activeListings: 0,
  });

  const [imageToCrop, setImageToCrop] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  // Modal state
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  const showModal = (title, message, type = "info") => {
    setModal({ isOpen: true, title, message, type });
  };

  const closeModal = () => {
    setModal({ ...modal, isOpen: false });
  };

  useEffect(() => {
    loadMyListings();
  }, []);

  const loadMyListings = async () => {
    setLoading(true);
    try {
      const result = await productsService.getMyProducts("available");

      if (result.success && result.products) {
        setMyListings(result.products);

        const totalViews = result.products.reduce(
          (sum, p) => sum + (p.views || 0),
          0,
        );
        setStats({
          totalListings: result.products.length,
          totalViews: totalViews,
          totalSold: result.products.filter((p) => p.status === "sold").length,
          activeListings: result.products.filter(
            (p) => p.status === "available",
          ).length,
        });
      } else {
        console.error("Failed to load products:", result.message);
        setMyListings([]);
      }
    } catch (error) {
      console.error("Error loading listings:", error);
      setMyListings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageToCrop(reader.result);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImage) => {
    setProfileData({ ...profileData, avatar: croppedImage });
    setShowCropper(false);
    setImageToCrop(null);
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setImageToCrop(null);
  };

  const handleCancelEdit = () => {
    // Revert profileData back to original user data
    setProfileData({
      name: user?.fullName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      location: user?.location || "",
      bio: user?.bio || "",
      avatar: user?.avatarUrl || null,
      verified: user?.isVerified || false,
      joinedDate: user?.createdAt || new Date().toISOString(),
    });
    setIsEditMode(false);
  };

  const handleSaveProfile = async () => {
    try {
      // Prepare data for backend (only send fields that backend accepts)
      const updateData = {
        bio: profileData.bio,
        location: profileData.location,
        phone: profileData.phone,
        avatarUrl: profileData.avatar,
      };

      const result = await updateUser(updateData);
      if (result.success) {
        setIsEditMode(false);
        showModal("Success!", "Profile updated successfully!", "success");
      } else {
        showModal(
          "Error",
          result.message || "Failed to update profile. Please try again.",
          "error",
        );
      }
    } catch (error) {
      console.error("Profile update error:", error);
      showModal(
        "Error",
        "Failed to update profile. Please try again.",
        "error",
      );
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const tabs = [
    {
      id: "listings",
      label: "My Listings",
      icon: FaBox,
      count: stats.totalListings,
    },
    {
      id: "sold",
      label: "Sold Items",
      icon: FaShoppingBag,
      count: stats.totalSold,
    },
    { id: "stats", label: "Statistics", icon: FaEye, count: null },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Image Cropper Modal */}
      {showCropper && imageToCrop && (
        <ImageCropper
          image={imageToCrop}
          onComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-inter font-bold text-gray-900">
              My Profile
            </h1>
            <Button
              variant="outline"
              size="sm"
              icon={<FaCog />}
              onClick={() => navigate("/dashboard/settings")}
            >
              Settings
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card>
              <ProfileHeader
                profileData={profileData}
                isEditMode={isEditMode}
                onEdit={setProfileData}
                onEditModeToggle={() => setIsEditMode(true)}
                onSave={handleSaveProfile}
                onCancel={handleCancelEdit}
                onAvatarChange={handleAvatarChange}
              />
            </Card>

            {/* Contact Info Card */}
            <Card>
              <h3 className="font-inter font-semibold text-gray-900 mb-4">
                Contact Information
              </h3>
              <ContactInfo
                profileData={profileData}
                isEditMode={isEditMode}
                onEdit={setProfileData}
                formatDate={formatDate}
              />
            </Card>

            {/* Stats Card */}
            <Card>
              <h3 className="font-inter font-semibold text-gray-900 mb-4">
                Quick Stats
              </h3>
              <StatsCard stats={stats} />
            </Card>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <Card padding="none">
              <div className="flex border-b border-gray-200">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-2 sm:px-4 py-3 font-instrument font-semibold transition-colors text-xs sm:text-sm ${
                      activeTab === tab.id
                        ? "text-[#7E22CE] border-b-2 border-[#7E22CE]"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <span className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
                      <tab.icon className="text-base sm:text-lg" />
                      <span className="hidden sm:inline">{tab.label}</span>
                      <span className="sm:hidden text-[10px]">
                        {tab.id === "listings"
                          ? "Listings"
                          : tab.label.split(" ")[0]}
                      </span>
                      {tab.count !== null && (
                        <span className="px-1.5 sm:px-2 py-0.5 bg-gray-100 rounded-full text-[10px] sm:text-xs">
                          {tab.count}
                        </span>
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </Card>

            {/* Tab Content */}
            {activeTab === "listings" && (
              <ListingsTab
                listings={myListings}
                loading={loading}
                onNavigate={navigate}
              />
            )}

            {activeTab === "sold" && (
              <Card>
                <div className="text-center py-12">
                  <FaShoppingBag className="text-6xl text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-inter font-semibold text-gray-900 mb-2">
                    No sold items yet
                  </h3>
                  <p className="text-gray-600 font-instrument">
                    Your sold items will appear here
                  </p>
                </div>
              </Card>
            )}

            {activeTab === "stats" && <PerformanceStats stats={stats} />}
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />
    </div>
  );
};

export default Profile;
