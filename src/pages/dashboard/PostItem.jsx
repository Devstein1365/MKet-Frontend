import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaImage,
  FaTimes,
  FaCloudUploadAlt,
  FaMapMarkerAlt,
  FaTag,
  FaBox,
  FaDollarSign,
  FaMagic,
  FaSpinner,
  FaSave,
  FaEye,
  FaTrash,
  FaFileAlt,
  FaPaperPlane,
  FaBan,
  FaPlus,
} from "react-icons/fa";
import Button from "../../components/shared/Button";
import Input from "../../components/shared/Input";
import Modal from "../../components/shared/Modal";
import CustomSelect from "../../components/shared/CustomSelect";
import { categories as categoriesData } from "../../services/productsService";
import productsService from "../../services/productsService";
import {
  locationAreas,
  specificLocations,
  getLocationDisplayName,
} from "../../data/locations";
import cloudinaryService from "../../services/cloudinaryService";
import { generateProductDescription } from "../../services/geminiService";
import {
  formatAsUserTyping,
  formatOnBlur,
  parseToNumber,
  toKobo,
  cleanNumber,
} from "../../utils/price";

const DRAFTS_KEY = "mket_drafts";

const PostItem = () => {
  const [images, setImages] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [tappedImageId, setTappedImageId] = useState(null); // For mobile tap to show remove button
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    condition: "Used",
    locationArea: "",
    locationSpecific: "",
  });
  const [errors, setErrors] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentDraftId, setCurrentDraftId] = useState(null);
  const [drafts, setDrafts] = useState([]);
  const [showDrafts, setShowDrafts] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [lastSavedDraft, setLastSavedDraft] = useState(null); // Track last saved state

  // Modal state
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    onConfirm: null,
    showCancel: false,
  });

  // Load drafts on mount
  useEffect(() => {
    loadDrafts();
  }, []);

  // Auto-save draft every 30 seconds if there's content
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (hasContent() && !showPreview) {
        saveDraft(true); // silent save
      }
    }, 30000); // 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [formData, images]);

  // Load drafts from localStorage
  const loadDrafts = () => {
    try {
      const savedDrafts = localStorage.getItem(DRAFTS_KEY);
      if (savedDrafts) {
        setDrafts(JSON.parse(savedDrafts));
      }
    } catch (error) {
      console.error("Error loading drafts:", error);
    }
  };

  // Check if form has any content
  const hasContent = () => {
    return (
      formData.title.trim() ||
      formData.description.trim() ||
      formData.price ||
      formData.originalPrice ||
      formData.category ||
      formData.location ||
      images.length > 0
    );
  };

  // Check if content has changed since last save
  const hasChangedSinceLastSave = () => {
    if (!lastSavedDraft) return true; // No previous save, so it's changed

    // Compare form data
    const formChanged =
      JSON.stringify(formData) !== JSON.stringify(lastSavedDraft.formData);

    // Compare images (only IDs and previews)
    const currentImageData = images.map((img) => ({
      id: img.id,
      preview: img.preview,
    }));
    const imagesChanged =
      JSON.stringify(currentImageData) !==
      JSON.stringify(lastSavedDraft.images);

    return formChanged || imagesChanged;
  };

  // Save draft
  const saveDraft = (silent = false) => {
    if (!hasContent()) {
      if (!silent) {
        showModal(
          "No Content",
          "Please add some content before saving as draft.",
          "warning",
        );
      }
      return;
    }

    // Check if content has changed since last save
    if (!hasChangedSinceLastSave()) {
      if (!silent) {
        showModal("No Changes", "No changes detected since last save.", "info");
      }
      return;
    }

    try {
      const draftData = {
        formData,
        images: images.map((img) => ({
          id: img.id,
          preview: img.preview,
        })),
      };

      const draft = {
        id: currentDraftId || `draft_${Date.now()}`,
        ...draftData,
        timestamp: Date.now(),
      };

      const savedDrafts = JSON.parse(localStorage.getItem(DRAFTS_KEY) || "[]");
      const existingIndex = savedDrafts.findIndex((d) => d.id === draft.id);

      if (existingIndex >= 0) {
        // Update existing draft
        savedDrafts[existingIndex] = draft;
      } else {
        // Check if similar draft exists (same title)
        const similarDraftIndex = savedDrafts.findIndex(
          (d) =>
            d.formData.title &&
            d.formData.title.toLowerCase().trim() ===
              formData.title.toLowerCase().trim(),
        );

        if (similarDraftIndex >= 0 && !currentDraftId) {
          // Ask user if they want to update the similar draft
          if (!silent) {
            showModal(
              "Similar Draft Exists",
              `A draft with the title "${formData.title}" already exists. The existing draft has been updated.`,
              "info",
            );
          }
          // Update the similar draft
          draft.id = savedDrafts[similarDraftIndex].id;
          savedDrafts[similarDraftIndex] = draft;
          setCurrentDraftId(draft.id);
        } else {
          // Add new draft at the beginning
          savedDrafts.unshift(draft);
        }
      }

      // Keep only last 10 drafts
      const limitedDrafts = savedDrafts.slice(0, 10);
      localStorage.setItem(DRAFTS_KEY, JSON.stringify(limitedDrafts));

      setCurrentDraftId(draft.id);
      setDrafts(limitedDrafts);
      setLastSavedDraft(draftData); // Update last saved state

      if (!silent) {
        showModal(
          "Draft Saved",
          "Your listing has been saved as a draft!",
          "success",
        );
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      if (!silent) {
        showModal(
          "Save Failed",
          "Failed to save draft. Please try again.",
          "error",
        );
      }
    }
  };

  // Load a draft
  const loadDraft = (draft) => {
    setFormData(draft.formData);
    setImages(draft.images);
    setCurrentDraftId(draft.id);
    setLastSavedDraft({
      formData: draft.formData,
      images: draft.images,
    }); // Set last saved state when loading
    setShowDrafts(false);
    showModal(
      "Draft Loaded",
      "Draft loaded successfully. Continue editing!",
      "success",
    );
  };

  // Delete a draft
  const deleteDraft = (draftId) => {
    try {
      const savedDrafts = JSON.parse(localStorage.getItem(DRAFTS_KEY) || "[]");
      const updatedDrafts = savedDrafts.filter((d) => d.id !== draftId);
      localStorage.setItem(DRAFTS_KEY, JSON.stringify(updatedDrafts));
      setDrafts(updatedDrafts);

      if (currentDraftId === draftId) {
        setCurrentDraftId(null);
      }

      showModal("Draft Deleted", "Draft has been removed.", "success");
    } catch (error) {
      console.error("Error deleting draft:", error);
      showModal("Delete Failed", "Failed to delete draft.", "error");
    }
  };

  // Clear current form
  const clearForm = () => {
    setFormData({
      title: "",
      description: "",
      price: "",
      originalPrice: "",
      category: "",
      condition: "Used",
      locationArea: "",
      locationSpecific: "",
    });
    setImages([]);
    setCurrentDraftId(null);
    setErrors({});
    setLastSavedDraft(null); // Clear last saved state
  };

  const showModal = (title, message, type = "info") => {
    setModal({ isOpen: true, title, message, type });
  };

  const closeModal = () => {
    setModal({ ...modal, isOpen: false });
  };

  // Handle image upload
  const handleImageUpload = async (files) => {
    const fileArray = Array.from(files);
    const remainingSlots = 6 - images.length;

    if (remainingSlots <= 0) {
      showModal(
        "Maximum Images Reached",
        "You can only upload up to 6 images.",
        "warning",
      );
      return;
    }

    // Validate all images before uploading
    const validFiles = [];
    for (const file of fileArray.slice(0, remainingSlots)) {
      const validation = cloudinaryService.validateImage(file);
      console.log("Validation result:", validation);
      if (validation.isValid) {
        validFiles.push(file);
      } else {
        console.error("Image validation failed:", validation.error);
        showModal(
          "Invalid Image",
          validation.error || "Unknown validation error",
          "error",
        );
        return; // Stop processing on first invalid file
      }
    }

    if (validFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Upload to Cloudinary with progress tracking
      const uploadedImages = await cloudinaryService.uploadMultipleImages(
        validFiles,
        (progress) => {
          setUploadProgress(progress);
        },
      );

      console.log("Cloudinary upload results:", uploadedImages);

      // Add uploaded images with their Cloudinary URLs and public_ids
      const newImages = uploadedImages.map((image) => ({
        id: Math.random().toString(36).substr(2, 9),
        url: image.url,
        public_id: image.public_id,
        preview: cloudinaryService.getThumbnailUrl(image.url, 400),
      }));

      console.log("New images to add:", newImages);
      setImages([...images, ...newImages]);

      showModal(
        "Success",
        `${validFiles.length} image(s) uploaded successfully!`,
        "success",
      );
    } catch (error) {
      console.error("Error uploading images:", error);
      showModal(
        "Upload Failed",
        error.message || "Failed to upload images. Please try again.",
        "error",
      );
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Handle drag and drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files);
    }
  };

  // Remove image
  const removeImage = (id) => {
    setImages(images.filter((img) => img.id !== id));
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Price formatting helpers
  const handlePriceChange = (name, rawValue) => {
    const formatted = formatAsUserTyping(rawValue);
    setFormData((prev) => ({ ...prev, [name]: formatted }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePriceBlur = (name) => {
    const val = formData[name];
    if (!val) return;
    const formatted = formatOnBlur(val);
    setFormData((prev) => ({ ...prev, [name]: formatted }));
  };

  const handlePriceFocus = (name) => {
    const val = formData[name];
    if (!val) return;
    // remove commas but keep decimals
    const raw = String(val).replace(/,/g, "");
    setFormData((prev) => ({ ...prev, [name]: raw }));
  };

  // Generate AI description
  const handleGenerateDescription = async () => {
    // Validate ALL required fields before AI generation
    // This ensures AI has complete context to generate accurate description

    if (!formData.title.trim()) {
      showModal(
        "Title Required",
        "Please enter a product title before using AI generation!",
        "warning",
      );
      return;
    }

    if (!formData.category) {
      showModal(
        "Category Required",
        "Please select a category before using AI generation!",
        "warning",
      );
      return;
    }

    if (!formData.condition) {
      showModal(
        "Condition Required",
        "Please select a condition (New, Used, or Fairly Used) before using AI generation!",
        "warning",
      );
      return;
    }

    if (!formData.price || Number(cleanNumber(formData.price)) <= 0) {
      showModal(
        "Price Required",
        "Please enter a valid selling price before using AI generation!",
        "warning",
      );
      return;
    }

    if (!formData.location || !formData.location.trim()) {
      showModal(
        "Location Required",
        "Please select or enter a location before using AI generation!",
        "warning",
      );
      return;
    }

    if (images.length === 0) {
      showModal(
        "Images Required",
        "Please upload at least one product image before using AI generation!",
        "warning",
      );
      return;
    }

    setIsGenerating(true);
    try {
      const description = await generateProductDescription(formData);
      setFormData((prev) => ({
        ...prev,
        description,
      }));
      // Clear any description error
      if (errors.description) {
        setErrors((prev) => ({ ...prev, description: "" }));
      }

      showModal(
        "Description Generated!",
        "AI has generated a product description. Feel free to edit it to add more details!",
        "success",
      );
    } catch (error) {
      console.error("Error generating description:", error);
      showModal(
        "Generation Failed",
        "Failed to generate description. Please try again or write it manually.",
        "error",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Product title is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.price || parseToNumber(formData.price) <= 0) {
      newErrors.price = "Valid price is required";
    }
    if (!formData.category) {
      newErrors.category = "Please select a category";
    }
    if (!formData.locationArea) {
      newErrors.locationArea = "Please select campus area";
    }
    if (!formData.locationSpecific) {
      newErrors.locationSpecific = "Please select specific location";
    }
    if (images.length === 0) {
      newErrors.images = "At least 1 image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Show preview
  const handlePreview = () => {
    if (!validateForm()) {
      showModal(
        "Incomplete Form",
        "Please fill all required fields to preview.",
        "warning",
      );
      return;
    }
    setShowPreview(true);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Check if images have been uploaded to Cloudinary
    console.log("Current images array:", images);
    console.log("First image:", images[0]);

    if (images.length > 0 && !images[0].url) {
      console.error("Images missing URL property:", images);
      showModal(
        "Images not uploaded",
        "Please wait for images to finish uploading to Cloudinary.",
        "warning",
      );
      return;
    }

    // Prepare submission payload with Cloudinary image data
    const submitPayload = {
      ...formData,
      // Combine location fields into single display string
      location: getLocationDisplayName(
        formData.locationArea,
        formData.locationSpecific,
      ),
      price: parseToNumber(formData.price),
      originalPrice: formData.originalPrice
        ? parseToNumber(formData.originalPrice)
        : null,
      images: images.map((img) => ({
        url: img.url,
        public_id: img.public_id,
      })),
    };

    // Remove the separate location fields from payload (keep for form state only)
    delete submitPayload.locationArea;
    delete submitPayload.locationSpecific;

    console.log("Submitting product:", submitPayload);

    // Show loading state
    showModal("Posting...", "Please wait while we post your product", "info");

    try {
      // Submit to backend
      const result = await productsService.createProduct(submitPayload);

      if (result.success) {
        // Delete draft if it was loaded from drafts
        if (currentDraftId) {
          deleteDraft(currentDraftId);
        }

        // Show success message
        showModal(
          "Success!",
          result.message || "Product posted successfully!",
          "success",
        );

        // Clear form after successful submission
        setTimeout(() => {
          clearForm();
        }, 2000);
      } else {
        // Show error message
        showModal(
          "Error",
          result.message || "Failed to post product. Please try again.",
          "error",
        );
      }
    } catch (error) {
      console.error("Error posting product:", error);
      showModal(
        "Error",
        "An error occurred while posting your product. Please try again.",
        "error",
      );
    }
  };

  const conditions = ["New", "Used", "Fairly Used"];

  // Available specific locations based on selected area
  const availableSpecificLocations = formData.locationArea
    ? specificLocations[formData.locationArea] || []
    : [];

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      {/* Header with Drafts and New Button */}
      <div className="mb-6 flex items-start justify-between gap-3">
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-inter font-bold text-[#111827] mb-2">
            Post New Item
          </h1>
          <p className="text-[#4B5563] font-instrument">
            Fill in the details below to list your item for sale
          </p>
          {currentDraftId && (
            <p className="text-xs text-[#7E22CE] font-instrument mt-1">
              📝 Editing draft - changes auto-save
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {hasContent() && (
            <button
              type="button"
              onClick={() => {
                if (hasContent()) {
                  setModal({
                    isOpen: true,
                    title: "Start New Draft?",
                    message: hasChangedSinceLastSave()
                      ? "You have unsaved changes. Save current draft before starting a new one?"
                      : "Clear current form and start a new listing?",
                    type: "confirm",
                    onConfirm: () => {
                      if (hasChangedSinceLastSave()) {
                        saveDraft(true);
                      }
                      clearForm();
                      showModal(
                        "New Draft Started",
                        "You can now create a new listing!",
                        "success",
                      );
                    },
                    showCancel: true,
                  });
                } else {
                  clearForm();
                }
              }}
              className="flex items-center gap-2 px-3 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-inter font-medium hover:bg-gray-50 transition-all"
              title="Start a new draft"
            >
              <FaPlus />
              <span className="hidden sm:inline text-sm">New</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowDrafts(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-[#7E22CE] text-[#7E22CE] rounded-lg font-inter font-medium hover:bg-[#7E22CE] hover:text-white transition-all"
          >
            <FaFileAlt />
            <span className="hidden sm:inline">Drafts</span>
            {drafts.length > 0 && (
              <span className="bg-[#7E22CE] text-white px-2 py-0.5 rounded-full text-xs">
                {drafts.length}
              </span>
            )}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <FaImage className="text-[#7E22CE] text-xl" />
            <h2 className="text-lg font-inter font-semibold text-[#111827]">
              Product Images
            </h2>
            <span className="text-sm text-[#4B5563] font-instrument">
              ({images.length}/6)
            </span>
          </div>

          {/* Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
              dragActive
                ? "border-[#7E22CE] bg-[#7E22CE]/5"
                : "border-gray-300 hover:border-[#7E22CE]"
            } ${
              images.length >= 6 || isUploading
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => {
              if (images.length < 6 && !isUploading) {
                document.getElementById("file-input").click();
              }
            }}
          >
            <input
              id="file-input"
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files)}
              className="hidden"
              disabled={images.length >= 6 || isUploading}
            />

            {isUploading ? (
              <>
                <FaSpinner className="text-5xl text-[#7E22CE] mx-auto mb-4 animate-spin" />
                <h3 className="text-lg font-inter font-semibold text-[#111827] mb-2">
                  Uploading to Cloudinary...
                </h3>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                  <div
                    className="bg-[#7E22CE] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-[#4B5563] font-instrument mt-2">
                  {uploadProgress}% complete
                </p>
              </>
            ) : (
              <>
                <FaCloudUploadAlt className="text-5xl text-[#7E22CE] mx-auto mb-4" />
                <h3 className="text-lg font-inter font-semibold text-[#111827] mb-2">
                  {images.length >= 6
                    ? "Maximum images reached"
                    : "Drop images here or click to upload"}
                </h3>
                <p className="text-sm text-[#4B5563] font-instrument">
                  Minimum 1 image, Maximum 6 images (JPG, PNG, WEBP, max 10MB
                  each)
                </p>
              </>
            )}
          </div>

          {errors.images && (
            <p className="text-red-500 text-sm mt-2 font-instrument">
              {errors.images}
            </p>
          )}

          {/* Image Preview - Horizontal Scroll */}
          {images.length > 0 && (
            <div className="mt-6 overflow-x-auto">
              <div className="flex gap-3 pb-2">
                <AnimatePresence>
                  {images.map((image, index) => (
                    <motion.div
                      key={image.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200 group"
                      onClick={() => {
                        // Toggle tapped state for mobile - tap to show/hide remove button
                        setTappedImageId(
                          tappedImageId === image.id ? null : image.id,
                        );
                      }}
                    >
                      <img
                        src={image.preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {index === 0 && (
                        <div className="absolute top-1 left-1 bg-[#7E22CE] text-white text-[10px] font-inter font-semibold px-1.5 py-0.5 rounded">
                          Main
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(image.id);
                          setTappedImageId(null); // Reset after removal
                        }}
                        className={`absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center transition-opacity ${
                          tappedImageId === image.id
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-100"
                        }`}
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <FaBox className="text-[#7E22CE] text-xl" />
            <h2 className="text-lg font-inter font-semibold text-[#111827]">
              Product Details
            </h2>
          </div>

          {/* Title */}
          <Input
            label="Product Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g., iPhone 13 Pro Max 256GB"
            error={errors.title}
            required
          />

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-inter font-medium text-[#111827]">
                Description <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleGenerateDescription}
                disabled={
                  isGenerating ||
                  !formData.title.trim() ||
                  !formData.category ||
                  !formData.price
                }
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-linear-to-r from-[#7E22CE] to-[#14B8A6] text-white text-sm font-inter font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FaMagic />
                    AI Generate
                  </>
                )}
              </button>
            </div>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your product in detail... or use AI to generate"
              rows={4}
              disabled={isGenerating}
              className={`w-full px-4 py-3 border rounded-lg font-instrument text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#7E22CE] focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
            />
            {(!formData.title.trim() ||
              !formData.category ||
              !formData.price) && (
              <p className="text-[#6B7280] text-xs mt-1 font-instrument">
                💡 Fill in Title, Category, and Price first to use AI generation
              </p>
            )}
            {errors.description && (
              <p className="text-red-500 text-sm mt-1 font-instrument">
                {errors.description}
              </p>
            )}
          </div>

          {/* Category */}
          <CustomSelect
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            options={categoriesData
              .filter((cat) => cat.id !== "all")
              .map((category) => ({
                value: category.id,
                label: category.name,
                icon: category.icon,
              }))}
            placeholder="Select a category"
            icon={FaTag}
            error={errors.category}
            required
          />

          {/* Condition */}
          <div>
            <label className="block text-sm font-inter font-medium text-[#111827] mb-2">
              Condition <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              {conditions.map((condition) => (
                <button
                  key={condition}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, condition }))
                  }
                  className={`flex-1 py-3 rounded-lg font-inter font-medium transition-all ${
                    formData.condition === condition
                      ? "bg-[#7E22CE] text-white"
                      : "bg-gray-100 text-[#4B5563] hover:bg-gray-200"
                  }`}
                >
                  {condition}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <FaDollarSign className="text-[#7E22CE] text-xl" />
            <h2 className="text-lg font-inter font-semibold text-[#111827]">
              Pricing
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Selling Price"
              name="price"
              type="text"
              value={formData.price}
              onChange={(e) => handlePriceChange("price", e.target.value)}
              onBlur={() => handlePriceBlur("price")}
              onFocus={() => handlePriceFocus("price")}
              placeholder="0"
              leftIcon={<span className="text-[#4B5563]">₦</span>}
              error={errors.price}
              required
            />

            <Input
              label="Original Price (Optional)"
              name="originalPrice"
              type="text"
              value={formData.originalPrice}
              onChange={(e) =>
                handlePriceChange("originalPrice", e.target.value)
              }
              onBlur={() => handlePriceBlur("originalPrice")}
              onFocus={() => handlePriceFocus("originalPrice")}
              placeholder="0"
              leftIcon={<span className="text-[#4B5563]">₦</span>}
              helperText="Show discount if item was more expensive"
            />
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <FaMapMarkerAlt className="text-[#7E22CE] text-xl" />
            <h2 className="text-lg font-inter font-semibold text-[#111827]">
              Location
            </h2>
          </div>

          <div className="space-y-4">
            {/* Step 1: Select Area (Off-Campus, Inside Campus, Bosso) */}
            <CustomSelect
              label="Campus Area"
              name="locationArea"
              value={formData.locationArea}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  locationArea: e.target.value,
                  locationSpecific: "", // Reset specific location when area changes
                }));
              }}
              options={locationAreas.map((area) => ({
                value: area.id,
                label: area.name,
                description: area.description,
              }))}
              placeholder="Select campus area"
              icon={FaMapMarkerAlt}
              error={errors.locationArea}
              required
            />

            {/* Step 2: Select Specific Location (only shown after area is selected) */}
            {formData.locationArea && (
              <CustomSelect
                label="Specific Location"
                name="locationSpecific"
                value={formData.locationSpecific}
                onChange={handleInputChange}
                options={availableSpecificLocations.map((loc) => ({
                  value: loc.id,
                  label: loc.name,
                }))}
                placeholder={`Select location in ${locationAreas.find((a) => a.id === formData.locationArea)?.name}`}
                icon={FaMapMarkerAlt}
                error={errors.locationSpecific}
                required
              />
            )}

            {/* Show warning for Bosso (distant location) */}
            {formData.locationArea === "bosso" && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <span className="text-amber-600 text-sm">⚠️</span>
                <p className="text-sm text-amber-700 font-instrument">
                  Note: Bosso is quite far from the main campus area. This might
                  affect delivery or meetup options.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-3 py-3 sm:py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-inter font-medium hover:bg-gray-50 transition-all"
          >
            <FaBan className="text-lg sm:text-base" />
            <span className="text-xs sm:text-sm">Cancel</span>
          </button>
          <button
            type="button"
            onClick={() => saveDraft(false)}
            className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-3 py-3 sm:py-2.5 border-2 border-[#7E22CE] text-[#7E22CE] rounded-lg font-inter font-medium hover:bg-[#7E22CE] hover:text-white transition-all"
          >
            <FaSave className="text-lg sm:text-base" />
            <span className="text-xs sm:text-sm">Draft</span>
          </button>
          <button
            type="button"
            onClick={handlePreview}
            className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-3 py-3 sm:py-2.5 border-2 border-[#14B8A6] text-[#14B8A6] rounded-lg font-inter font-medium hover:bg-[#14B8A6] hover:text-white transition-all"
          >
            <FaEye className="text-lg sm:text-base" />
            <span className="text-xs sm:text-sm">Preview</span>
          </button>
          <button
            type="submit"
            className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-3 py-3 sm:py-2.5 bg-gradient-to-r from-[#7E22CE] to-[#14B8A6] text-white rounded-lg font-inter font-medium hover:shadow-lg transition-all"
          >
            <FaPaperPlane className="text-lg sm:text-base" />
            <span className="text-xs sm:text-sm">Post</span>
          </button>
        </div>
      </form>

      {/* Drafts Modal */}
      <Modal
        isOpen={showDrafts}
        onClose={() => setShowDrafts(false)}
        title="Saved Drafts"
      >
        <div className="max-h-96 overflow-y-auto">
          {drafts.length === 0 ? (
            <div className="text-center py-8">
              <FaFileAlt className="text-5xl text-gray-300 mx-auto mb-3" />
              <p className="text-[#4B5563] font-instrument">No saved drafts</p>
            </div>
          ) : (
            <div className="space-y-3">
              {drafts.map((draft) => (
                <div
                  key={draft.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-[#7E22CE] transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-inter font-semibold text-[#111827] truncate mb-1">
                        {draft.formData.title || "Untitled Draft"}
                      </h3>
                      <p className="text-sm text-[#4B5563] font-instrument truncate mb-2">
                        {draft.formData.description || "No description"}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-[#6B7280] font-instrument">
                        <span>
                          {new Date(draft.timestamp).toLocaleDateString()} at{" "}
                          {new Date(draft.timestamp).toLocaleTimeString()}
                        </span>
                        {draft.images.length > 0 && (
                          <span>• {draft.images.length} image(s)</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => loadDraft(draft)}
                        className="px-3 py-1.5 bg-[#7E22CE] text-white rounded-lg text-sm font-inter font-medium hover:bg-[#6b1bb3] transition-all"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => deleteDraft(draft.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title="Preview Your Listing"
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Preview Images */}
          {images.length > 0 ? (
            <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={images[0].preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              {images.length > 1 && (
                <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs font-inter">
                  +{images.length - 1} more
                </div>
              )}
            </div>
          ) : (
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <FaImage className="text-5xl text-gray-300 mx-auto mb-2" />
                <p className="text-gray-400 font-instrument">No images</p>
              </div>
            </div>
          )}

          {/* Preview Details */}
          <div className="space-y-3">
            <div>
              <h2 className="text-xl font-inter font-bold text-[#111827] mb-1">
                {formData.title || "No title"}
              </h2>
              <div className="flex items-center gap-2 text-sm text-[#6B7280] font-instrument">
                <FaMapMarkerAlt className="text-[#7E22CE]" />
                <span>{formData.location || "No location"}</span>
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-inter font-bold text-[#7E22CE]">
                ₦{formData.price || "0"}
              </span>
              {formData.originalPrice && (
                <span className="text-sm text-[#6B7280] line-through font-instrument">
                  ₦{formData.originalPrice}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.category && (
                <span className="px-3 py-1 bg-[#7E22CE]/10 text-[#7E22CE] rounded-full text-sm font-inter">
                  {categoriesData.find((c) => c.id === formData.category)
                    ?.name || formData.category}
                </span>
              )}
              <span className="px-3 py-1 bg-gray-100 text-[#4B5563] rounded-full text-sm font-inter">
                {formData.condition}
              </span>
            </div>

            <div>
              <h3 className="font-inter font-semibold text-[#111827] mb-2">
                Description
              </h3>
              <p className="text-[#4B5563] font-instrument whitespace-pre-wrap">
                {formData.description || "No description provided"}
              </p>
            </div>
          </div>

          {/* Preview Actions */}
          <div className="flex gap-3 pt-4 border-t sticky bottom-0 bg-white">
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={() => setShowPreview(false)}
            >
              Edit
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="flex-1"
              onClick={(e) => {
                setShowPreview(false);
                handleSubmit(e);
              }}
            >
              Publish Now
            </Button>
          </div>
        </div>
      </Modal>

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

export default PostItem;
