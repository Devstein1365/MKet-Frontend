import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaTimes, FaTag, FaMapMarkerAlt, FaSort } from "react-icons/fa";
import Button from "../shared/Button";
import CustomSelect from "../shared/CustomSelect";
import { categories as categoriesData } from "../../data/categories";

const FilterPanel = ({
  filters,
  handleFilterChange,
  clearAllFilters,
  activeFiltersCount,
  showFilters,
  setShowFilters,
  showDesktopFilters,
  isMobile = false,
}) => {
  const conditions = [
    { id: "all", name: "All Conditions" },
    { id: "NEW", name: "Brand New" },
    { id: "USED", name: "Used - Like New" },
    { id: "FAIRLY_USED", name: "Fairly Used" },
  ];

  const statuses = [
    { id: "all", name: "All Statuses" },
    { id: "AVAILABLE", name: "Available" },
    { id: "RESERVED", name: "Reserved" },
    { id: "SOLD", name: "Sold" },
  ];

  const locations = [
    { id: "all", name: "All Locations" },
    { id: "MM Castle", name: "MM Castle" },
    { id: "Talba Road", name: "Talba Road" },
    { id: "School Gate", name: "School Gate" },
    { id: "Bosso Campus", name: "Bosso Campus" },
    { id: "Main Campus", name: "Main Campus" },
    { id: "Gidan Kwano", name: "Gidan Kwano" },
  ];

  const sortOptions = [
    { id: "relevance", name: "Most Relevant" },
    { id: "newest", name: "Newest First" },
    { id: "price-low", name: "Price: Low to High" },
    { id: "price-high", name: "Price: High to Low" },
    { id: "popular", name: "Most Popular" },
  ];

  const FilterContent = () => (
    <>
      {/* Category */}
      <div className="mb-4">
        <CustomSelect
          label="Category"
          name="category"
          value={filters.category}
          onChange={(e) => handleFilterChange("category", e.target.value)}
          options={[
            { value: "all", label: "All Categories" },
            ...categoriesData.map((cat) => ({
              value: cat.id,
              label: cat.name,
              icon: cat.icon,
            })),
          ]}
          icon={FaTag}
        />
      </div>

      {/* Condition */}
      <div className="mb-4">
        <h4 className="font-inter font-semibold text-sm mb-2">Condition</h4>
        <div className="space-y-2">
          {conditions.map((condition) => (
            <label
              key={condition.id}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                name={isMobile ? "condition-mobile" : "condition"}
                value={condition.id}
                checked={filters.condition === condition.id}
                onChange={(e) =>
                  handleFilterChange("condition", e.target.value)
                }
                className="w-4 h-4 text-[#7E22CE]"
              />
              <span className="text-sm text-[#4B5563]">{condition.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-4">
        <h4 className="font-inter font-semibold text-sm mb-2">Price Range</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.priceRange[0]}
            onChange={(e) =>
              handleFilterChange("priceRange", [
                parseInt(e.target.value) || 0,
                filters.priceRange[1],
              ])
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.priceRange[1]}
            onChange={(e) =>
              handleFilterChange("priceRange", [
                filters.priceRange[0],
                parseInt(e.target.value) || 1000000,
              ])
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
      </div>

      {/* Location */}
      <div className="mb-4">
        <CustomSelect
          label="Location"
          name="location"
          value={filters.location}
          onChange={(e) => handleFilterChange("location", e.target.value)}
          options={locations.map((loc) => ({
            value: loc.id,
            label: loc.name,
          }))}
          icon={FaMapMarkerAlt}
        />
      </div>

      {/* Sort */}
      <div>
        <CustomSelect
          label="Sort By"
          name="sortBy"
          value={filters.sortBy}
          onChange={(e) => handleFilterChange("sortBy", e.target.value)}
          options={sortOptions.map((opt) => ({
            value: opt.id,
            label: opt.name,
          }))}
          icon={FaSort}
        />
      </div>

      {/* Status */}
      <div className="mt-4">
        <CustomSelect
          label="Status"
          name="status"
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          options={statuses.map((status) => ({
            value: status.id,
            label: status.name,
          }))}
          icon={FaTag}
        />
      </div>
    </>
  );

  // Desktop Filter Sidebar
  if (!isMobile && showDesktopFilters) {
    return (
      <motion.aside
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: "16rem", opacity: 1 }}
        exit={{ width: 0, opacity: 0 }}
        className="hidden lg:block shrink-0"
      >
        <div className="sticky top-24 space-y-4 w-64">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-inter font-bold text-[#111827]">Filters</h3>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-[#7E22CE] hover:text-[#6b1fb8] font-medium"
                >
                  Clear All
                </button>
              )}
            </div>
            <FilterContent />
          </div>
        </div>
      </motion.aside>
    );
  }

  // Mobile Filter Overlay
  if (isMobile) {
    return (
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white z-50 lg:hidden overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
                <h3 className="font-inter font-bold text-[#111827]">Filters</h3>
                <button onClick={() => setShowFilters(false)} className="p-2">
                  <FaTimes className="text-[#4B5563]" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                <FilterContent />
              </div>

              <div className="sticky bottom-0 bg-white border-t p-4 flex gap-3">
                <Button variant="outline" onClick={clearAllFilters} fullWidth>
                  Clear All
                </Button>
                <Button onClick={() => setShowFilters(false)} fullWidth>
                  Apply
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  return null;
};

export default FilterPanel;
