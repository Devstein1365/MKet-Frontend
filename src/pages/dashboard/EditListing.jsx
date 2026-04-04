import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaImage,
  FaTimes,
  FaCloudUploadAlt,
  FaMapMarkerAlt,
  FaTag,
  FaDollarSign,
  FaSave,
  FaTrash,
  FaSpinner,
  FaArrowLeft,
  FaCheckCircle,
  FaArchive,
  FaUnlockAlt,
} from "react-icons/fa";
import Button from "../../components/shared/Button";
import Input from "../../components/shared/Input";
import CustomSelect from "../../components/shared/CustomSelect";
import productsService from "../../services/productsService";
import cloudinaryService from "../../services/cloudinaryService";

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    condition: "Used",
    location: "",
    status: "AVAILABLE",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const result = await productsService.getProductById(id);
        if (result.success && result.product) {
          const { product } = result;
          setFormData({
            title: product.title,
            description: product.description,
            price: product.price.toString(),
            originalPrice: product.originalPrice
              ? product.originalPrice.toString()
              : "",
            category: product.category,
            condition: product.condition,
            location: product.location,
            status: product.status,
          });
          setImages(product.images || []);
        } else {
          alert("Product not found");
          navigate("/dashboard/profile");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    if (images.length + files.length > 6) {
      alert("Maximum 6 images allowed");
      return;
    }

    setIsUploading(true);
    try {
      const uploadPromises = files.map((file) =>
        cloudinaryService.uploadImage(file, "products"),
      );
      const uploadedImages = await Promise.all(uploadPromises);
      setImages((prev) => [...prev, ...uploadedImages]);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload images");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.location) newErrors.location = "Location is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (images.length === 0) {
      alert("At least one image is required");
      return;
    }

    setSaving(true);
    try {
      const updateData = {
        ...formData,
        images,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice
          ? parseFloat(formData.originalPrice)
          : null,
      };

      const result = await productsService.updateProduct(id, updateData);
      if (result.success) {
        navigate(`/dashboard/product/${id}`);
      } else {
        alert(result.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("An error occurred while saving");
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (newStatus) => {
    setSaving(true);
    try {
      const result = await productsService.updateProduct(id, {
        status: newStatus,
      });
      if (result.success) {
        setFormData((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error("Status update error:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteListing = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this listing? This action cannot be undone.",
    );

    if (!confirmed) return;

    setSaving(true);
    try {
      const result = await productsService.deleteProduct(id);
      if (result.success) {
        navigate("/dashboard/profile");
      } else {
        alert(result.message || "Failed to delete listing");
      }
    } catch (error) {
      console.error("Delete listing error:", error);
      alert("An error occurred while deleting this listing");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-[#7E22CE]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[#4B5563] mb-6 hover:text-[#7E22CE] transition-colors"
      >
        <FaArrowLeft /> Back
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-[#111827]">Edit Listing</h1>

          <div className="flex items-center gap-3">
            {formData.status === "AVAILABLE" ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleStatus("ARCHIVED")}
                className="flex items-center gap-2 text-amber-600 border-amber-200 hover:bg-amber-50"
              >
                <FaArchive /> Archive
              </Button>
            ) : formData.status === "ARCHIVED" ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleStatus("AVAILABLE")}
                className="flex items-center gap-2 text-green-600 border-green-200 hover:bg-green-50"
              >
                <FaUnlockAlt /> Re-list
              </Button>
            ) : null}

            {formData.status !== "SOLD" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleStatus("SOLD")}
                className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
              >
                <FaCheckCircle /> Mark as Sold
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleDeleteListing}
              className="flex items-center gap-2 text-red-700 border-red-300 hover:bg-red-50"
              disabled={saving}
            >
              <FaTrash /> Delete
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Images Section */}
          <div>
            <label className="text-sm font-semibold text-[#374151] mb-3 flex items-center gap-2">
              <FaImage className="text-[#7E22CE]" /> Photos (Max 6)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group"
                >
                  <img
                    src={img.url || img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              ))}
              {images.length < 6 && (
                <label className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-[#7E22CE] hover:bg-gray-50 transition-all">
                  <FaCloudUploadAlt className="text-2xl text-gray-400" />
                  <span className="text-xs text-gray-500 mt-1">Add Photo</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Product Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              placeholder="e.g. iPhone 13 Pro Max"
              icon={FaTag}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Price (₦)"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                error={errors.price}
                placeholder="150,000"
                icon={FaDollarSign}
              />
              <Input
                label="Original Price (Optional)"
                name="originalPrice"
                type="number"
                value={formData.originalPrice}
                onChange={handleChange}
                placeholder="180,000"
                icon={FaDollarSign}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CustomSelect
              label="Condition"
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              options={[
                { value: "NEW", label: "Brand New" },
                { value: "USED", label: "Used - Like New" },
                { value: "FAIRLY_USED", label: "Fairly Used" },
              ]}
            />
            <Input
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              error={errors.location}
              placeholder="e.g. MM Castle"
              icon={FaMapMarkerAlt}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#374151] mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              className={`w-full px-4 py-3 rounded-xl border ${errors.description ? "border-red-500" : "border-gray-200"} focus:ring-2 focus:ring-[#7E22CE]/20 focus:border-[#7E22CE] outline-none transition-all resize-none`}
              placeholder="Tell buyers about your item..."
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              fullWidth
              disabled={saving || isUploading}
              className="flex items-center justify-center gap-2"
            >
              {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditListing;
