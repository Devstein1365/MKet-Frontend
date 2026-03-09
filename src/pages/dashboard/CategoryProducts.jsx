import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaFilter,
  FaSortAmountDown,
  FaThLarge,
  FaList,
  FaBox,
} from "react-icons/fa";
import { getCategoryById } from "../../data/categories";
import productsService from "../../services/productsService";
import ProductCard from "../../components/dashboard/ProductCard";
import Button from "../../components/shared/Button";
import CustomSelect from "../../components/shared/CustomSelect";

const CategoryProducts = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const category = getCategoryById(categoryId);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState("recent"); // 'recent', 'price-low', 'price-high', 'popular'
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [condition, setCondition] = useState("all"); // 'all', 'new', 'used', 'like-new'

  // Load all category products
  useEffect(() => {
    if (category) {
      loadCategoryProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  const loadCategoryProducts = async () => {
    setLoading(true);
    try {
      const data = await productsService.getProductsByCategory(categoryId);
      // data might be an array or an object { products: [], pagination: {} }
      const productsArray = Array.isArray(data) ? data : data?.products || [];
      setProducts(productsArray);
    } catch (error) {
      console.error("Error loading products:", error);
      setProducts([]); // Fallback to empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Apply filters and sorting
  const getFilteredAndSortedProducts = () => {
    let filtered = [...products];

    // Filter by price range
    if (priceRange.min) {
      filtered = filtered.filter(
        (p) => parseFloat(p.price) >= parseFloat(priceRange.min),
      );
    }
    if (priceRange.max) {
      filtered = filtered.filter(
        (p) => parseFloat(p.price) <= parseFloat(priceRange.max),
      );
    }

    // Filter by condition
    if (condition !== "all") {
      filtered = filtered.filter(
        (p) => p.condition?.toLowerCase() === condition,
      );
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "price-high":
        filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case "popular":
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case "recent":
      default:
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
    }

    return filtered;
  };

  const filteredProducts = getFilteredAndSortedProducts();

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-inter font-bold text-gray-900 mb-4">
            Category Not Found
          </h2>
          <Button onClick={() => navigate("/dashboard/categories")}>
            Back to Categories
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div
        className="bg-linear-to-r from-[#7E22CE] to-[#14B8A6] text-white"
        style={{ backgroundColor: `${category.color}20` }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors font-instrument"
          >
            <FaArrowLeft />
            Back
          </button>

          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
              style={{ backgroundColor: "white", color: category.color || "#000" }}
            >
              {category.icon && <category.icon />}
            </div>
            <div>
              <h1 className="text-3xl font-inter font-bold mb-2 text-white">
                {category.name}
              </h1>
              <p className="text-white/90 font-instrument">
                {category.description}
              </p>
            </div>
          </div>

          <p className="text-white/80 font-instrument">
            {filteredProducts.length} products available
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Left side - Filters */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                icon={<FaFilter />}
              >
                Filters
              </Button>

              {/* Sort Dropdown */}
              <CustomSelect
                name="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                options={[
                  { value: "recent", label: "Most Recent" },
                  { value: "price-low", label: "Price: Low to High" },
                  { value: "price-high", label: "Price: High to Low" },
                  { value: "popular", label: "Most Popular" },
                ]}
                icon={FaSortAmountDown}
                placeholder="Sort by"
              />
            </div>

            {/* Right side - View toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-[#7E22CE] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <FaThLarge />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list"
                    ? "bg-[#7E22CE] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <FaList />
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-inter">
                    Price Range
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) =>
                        setPriceRange({ ...priceRange, min: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7E22CE] focus:border-transparent font-instrument text-sm"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) =>
                        setPriceRange({ ...priceRange, max: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7E22CE] focus:border-transparent font-instrument text-sm"
                    />
                  </div>
                </div>

                {/* Condition */}
                <CustomSelect
                  label="Condition"
                  name="condition"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  options={[
                    { value: "all", label: "All Conditions" },
                    { value: "new", label: "New" },
                    { value: "like-new", label: "Like New" },
                    { value: "used", label: "Used" },
                  ]}
                  icon={FaBox}
                />

                {/* Clear Filters */}
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    onClick={() => {
                      setPriceRange({ min: "", max: "" });
                      setCondition("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Products Grid/List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && products.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#7E22CE]"></div>
            <p className="mt-4 text-gray-600 font-instrument">
              Loading products...
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 font-instrument mb-4">
              No products found in this category
            </p>
            <Link to="/dashboard/post">
              <Button>Be the first to post!</Button>
            </Link>
          </div>
        ) : (
          <>
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }
            >
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode={viewMode}
                  onClick={() => navigate(`/dashboard/product/${product.id}`)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;
