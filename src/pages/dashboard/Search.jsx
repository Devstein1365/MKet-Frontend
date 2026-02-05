import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaFilter,
  FaTimes,
  FaSlidersH,
  FaMapMarkerAlt,
  FaSortAmountDown,
  FaThLarge,
  FaList,
  FaSpinner,
} from "react-icons/fa";
import ProductCard from "../../components/dashboard/ProductCard";
import Input from "../../components/shared/Input";
import Button from "../../components/shared/Button";
import Badge from "../../components/shared/Badge";
import productsService from "../../services/productsService";
import { locationAreas, specificLocations, getAllLocationsFlat } from "../../data/locations";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState(""); // For typing without triggering search
  const [hasSearched, setHasSearched] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showDesktopFilters, setShowDesktopFilters] = useState(true); // Desktop filter sidebar toggle
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [filters, setFilters] = useState({
    category: "all",
    condition: "all",
    priceRange: [0, 1000000],
    locationArea: "all",
    locationSpecific: "all",
    sortBy: "relevance",
  });
  const [searchResults, setSearchResults] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const searchRef = useRef(null);
  const suggestionTimeoutRef = useRef(null);

  // Mock data - categories
  const categories = [
    { id: "all", name: "All Categories", count: 1234 },
    { id: "electronics", name: "Electronics", count: 245 },
    { id: "books", name: "Books & Stationery", count: 189 },
    { id: "fashion", name: "Fashion & Apparel", count: 312 },
    { id: "furniture", name: "Furniture", count: 78 },
    { id: "sports", name: "Sports & Fitness", count: 156 },
    { id: "accessories", name: "Accessories", count: 92 },
    { id: "gadgets", name: "Tech Gadgets", count: 203 },
  ];

  const conditions = [
    { id: "all", name: "All Conditions" },
    { id: "new", name: "Brand New" },
    { id: "used", name: "Used - Like New" },
    { id: "fairly-used", name: "Fairly Used" },
  ];

  const locations = [
    { id: "all", name: "All Locations" },
    ...locationAreas.map((area) => ({
      id: area.id,
      name: area.name,
      isArea: true,
    })),
  ];
  
  // Get specific locations for selected area
  const specificLocationOptions = filters.locationArea && filters.locationArea !== "all"
    ? specificLocations[filters.locationArea] || []
    : [];

  const sortOptions = [
    { id: "relevance", name: "Most Relevant" },
    { id: "newest", name: "Newest First" },
    { id: "price-low", name: "Price: Low to High" },
    { id: "price-high", name: "Price: High to Low" },
    { id: "popular", name: "Most Popular" },
  ];

  // Load all products on mount (for suggestions only)
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const result = await productsService.getAllProducts({ limit: 100 });
        if (result.success && result.products) {
          setAllProducts(result.products);
        }
      } catch (error) {
        console.error("Error loading products:", error);
      }
    };
    loadProducts();
  }, []);

  // Generate suggestions as user types
  useEffect(() => {
    if (suggestionTimeoutRef.current) {
      clearTimeout(suggestionTimeoutRef.current);
    }

    if (searchInput.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    suggestionTimeoutRef.current = setTimeout(() => {
      const query = searchInput.toLowerCase().trim();
      
      // Get matching products (limit to 5 for suggestions)
      const matchingProducts = allProducts
        .filter(product => 
          product.title.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
        )
        .slice(0, 5);

      // Get matching categories
      const matchingCategories = categories
        .filter(cat => 
          cat.id !== "all" && 
          cat.name.toLowerCase().includes(query)
        )
        .slice(0, 3);

      setSuggestions({
        products: matchingProducts,
        categories: matchingCategories,
      });
      setShowSuggestions(true);
    }, 300);

    return () => {
      if (suggestionTimeoutRef.current) {
        clearTimeout(suggestionTimeoutRef.current);
      }
    };
  }, [searchInput, allProducts]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Perform actual search
  // Helper to run a search with explicit query and filters (avoids race with setState)
  const searchWith = async (query, filtersOverride) => {
    const q = (query || "").trim();
    if (!q) return;

    setLoading(true);
    setHasSearched(true);
    setShowSuggestions(false);
    setSearchQuery(q);

    try {
      const result = await productsService.searchProducts(q, 1, 50);
      
      if (result.success) {
        let results = result.products;
        
        // Apply client-side filters
        const currentFilters = filtersOverride || filters;
        
        if (currentFilters.category !== 'all') {
          results = results.filter(p => p.category === currentFilters.category);
        }
        
        if (currentFilters.condition !== 'all') {
          results = results.filter(p => p.condition?.toLowerCase() === currentFilters.condition.toLowerCase());
        }
        
        if (currentFilters.location !== 'all') {
          results = results.filter(p => p.location?.toLowerCase().includes(currentFilters.location.toLowerCase()));
        }
        
        // Apply price range filter
        if (currentFilters.priceRange) {
          results = results.filter(p => 
            p.price >= currentFilters.priceRange[0] && 
            p.price <= currentFilters.priceRange[1]
          );
        }
        
        // Apply sorting
        if (currentFilters.sortBy) {
          switch (currentFilters.sortBy) {
            case 'newest':
              results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
              break;
            case 'price-low':
              results.sort((a, b) => a.price - b.price);
              break;
            case 'price-high':
              results.sort((a, b) => b.price - a.price);
              break;
            case 'popular':
              results.sort((a, b) => (b.views || 0) - (a.views || 0));
              break;
            default: // relevance - keep backend order
              break;
          }
        }
        
        setSearchResults(results);
      } else {
        console.error("Search error:", result.message);
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const performSearch = () => searchWith(searchInput, filters);

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      performSearch();
    }
  };

  // Handle suggestion click: immediately perform search using the clicked suggestion
  const handleSuggestionClick = async (suggestion, type) => {
    if (type === "product") {
      const q = suggestion.title;
      setSearchInput(q);
      // perform search with current filters
      await searchWith(q, filters);
    } else if (type === "category") {
      const q = suggestion.name;
      // apply category filter immediately and run search with that filter
      const newFilters = { ...filters, category: suggestion.id };
      setSearchInput(q);
      setFilters(newFilters);
      await searchWith(q, newFilters);
    }

    setShowSuggestions(false);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  // Apply filters to existing search results (client-side filtering)
  useEffect(() => {
    if (hasSearched && searchQuery && searchResults.length > 0) {
      // Re-run search with new filters
      searchWith(searchQuery, filters);
    }
  }, [filters]);

  const clearAllFilters = () => {
    setFilters({
      category: "all",
      condition: "all",
      priceRange: [0, 1000000],
      location: "all",
      sortBy: "relevance",
    });
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearchQuery("");
    setSearchResults([]);
    setHasSearched(false);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const activeFiltersCount = Object.values(filters).filter(
    (value) =>
      value !== "all" && value !== "relevance" && value !== filters.priceRange
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Search */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 ${!hasSearched ? 'flex justify-center' : ''}`}>
          {/* Search bar - centered before search, normal after */}
          <div className={`flex items-center gap-3 ${!hasSearched ? 'w-full max-w-3xl' : 'w-full'}`}>
            <div className="flex-1 relative" ref={searchRef}>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search for products, sellers, categories..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onFocus={() => searchInput.length >= 2 && setShowSuggestions(true)}
                  icon={<FaSearch />}
                  iconPosition="left"
                  fullWidth
                />
                {searchInput && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <FaTimes className="text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>

              {/* Suggestions Dropdown */}
              <AnimatePresence>
                {showSuggestions && (suggestions.products?.length > 0 || suggestions.categories?.length > 0) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50 max-h-96 overflow-y-auto"
                  >
                    {/* Category Suggestions */}
                    {suggestions.categories?.length > 0 && (
                      <div className="border-b border-gray-100">
                        <div className="px-4 py-2 bg-gray-50">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Categories
                          </p>
                        </div>
                        {suggestions.categories.map((category) => (
                          <button
                            key={category.id}
                            onClick={() => handleSuggestionClick(category, "category")}
                            className="w-full px-4 py-3 hover:bg-purple-50 transition-colors text-left flex items-center gap-3"
                          >
                            <FaFilter className="text-[#7E22CE]" />
                            <div>
                              <p className="font-inter font-medium text-gray-900">
                                {category.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {category.count} products
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Product Suggestions */}
                    {suggestions.products?.length > 0 && (
                      <div>
                        <div className="px-4 py-2 bg-gray-50">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Products
                          </p>
                        </div>
                        {suggestions.products.map((product) => (
                          <button
                            key={product.id}
                            onClick={() => handleSuggestionClick(product, "product")}
                            className="w-full px-4 py-3 hover:bg-purple-50 transition-colors text-left flex items-center gap-3"
                          >
                            <img
                              src={product.image}
                              alt={product.title}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-inter font-medium text-gray-900 truncate">
                                {product.title}
                              </p>
                              <p className="text-sm text-[#7E22CE] font-semibold">
                                ₦{product.price.toLocaleString()}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Search prompt */}
                    <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                      <p className="text-xs text-gray-500 text-center">
                        Press <kbd className="px-2 py-1 bg-white rounded border border-gray-300 font-mono">Enter</kbd> to search
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Search Button */}
            <Button
              onClick={performSearch}
              disabled={loading || !searchInput.trim()}
              className="px-6"
            >
              {loading ? (
                <FaSpinner className="animate-spin" />
              ) : (
                "Search"
              )}
            </Button>

            {/* Filter toggle button - Mobile - Only show after search */}
            {hasSearched && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden relative p-3 rounded-lg border-2 border-gray-200 hover:border-[#7E22CE] transition-colors"
              >
                <FaSlidersH className="text-[#7E22CE] text-lg" />
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#7E22CE] text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            )}
          </div>

          {/* Results info and view toggle */}
          {hasSearched && (
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm text-[#4B5563] font-instrument">
                  Found{" "}
                  <span className="font-semibold text-[#111827]">
                    {searchResults.length}
                  </span>{" "}
                  results
                </p>
                {searchQuery && (
                  <span className="text-sm text-[#4B5563] font-instrument">
                    for "
                    <span className="font-semibold text-[#7E22CE]">
                      {searchQuery}
                    </span>
                    "
                  </span>
                )}
              </div>

            {/* View mode and filter toggles */}
            <div className="flex items-center gap-2">
              {/* Desktop filter toggle */}
              <button
                onClick={() => setShowDesktopFilters(!showDesktopFilters)}
                className={`hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg transition-all font-inter text-sm ${
                  showDesktopFilters
                    ? "bg-[#7E22CE] text-white"
                    : "bg-gray-100 text-[#4B5563] hover:bg-gray-200"
                }`}
                title={showDesktopFilters ? "Hide filters" : "Show filters"}
              >
                <FaSlidersH />
                <span className="hidden xl:inline">Filters</span>
                {activeFiltersCount > 0 && !showDesktopFilters && (
                  <span className="w-5 h-5 bg-[#7E22CE] text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <div className="w-px h-6 bg-gray-300 hidden lg:block"></div>

              {/* View mode toggles */}
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-[#7E22CE] text-white"
                    : "bg-gray-100 text-[#4B5563] hover:bg-gray-200"
                }`}
              >
                <FaThLarge />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-[#7E22CE] text-white"
                    : "bg-gray-100 text-[#4B5563] hover:bg-gray-200"
                }`}
              >
                <FaList />
              </button>
            </div>
          </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Initial state - before search */}
        {!hasSearched ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mb-6">
              <FaSearch className="text-5xl text-[#7E22CE]" />
            </div>
            <h2 className="text-3xl font-inter font-bold text-[#111827] mb-3">
              Search for Products
            </h2>
            <p className="text-[#4B5563] font-instrument text-lg mb-6 max-w-2xl">
              Find what you're looking for from thousands of listings. Start typing to see suggestions.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 max-w-3xl">
              {categories.slice(1, 9).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSearchInput(cat.name);
                    handleFilterChange("category", cat.id);
                  }}
                  className="p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-[#7E22CE] hover:bg-purple-50 transition-all group"
                >
                  <p className="font-inter font-semibold text-gray-900 group-hover:text-[#7E22CE] text-sm">
                    {cat.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{cat.count} items</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex gap-6">
            {/* Filters Sidebar - Desktop with collapse */}
            <AnimatePresence mode="wait">
              {showDesktopFilters && (
              <motion.aside
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "16rem", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="hidden lg:block shrink-0 overflow-hidden"
              >
                <div className="sticky top-24 space-y-6 w-64">
                  {/* Filter header */}
                  <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200">
                    <h2 className="text-lg font-inter font-bold text-[#111827] flex items-center gap-2">
                      <FaFilter className="text-[#7E22CE]" />
                      Filters
                    </h2>
                    <div className="flex items-center gap-2">
                      {activeFiltersCount > 0 && (
                        <button
                          onClick={clearAllFilters}
                          className="text-xs text-[#7E22CE] hover:text-[#6b1fb8] font-inter font-medium"
                        >
                          Clear All
                        </button>
                      )}
                      <button
                        onClick={() => setShowDesktopFilters(false)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Hide filters"
                      >
                        <FaTimes className="text-[#4B5563] text-sm" />
                      </button>
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h3 className="font-inter font-semibold text-[#111827] mb-3 text-sm">
                      Category
                    </h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {categories.map((category) => (
                        <label
                          key={category.id}
                          className="flex items-center justify-between cursor-pointer group"
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="category"
                              value={category.id}
                              checked={filters.category === category.id}
                              onChange={(e) =>
                                handleFilterChange("category", e.target.value)
                              }
                              className="w-4 h-4 text-[#7E22CE] border-gray-300 focus:ring-[#7E22CE]"
                            />
                            <span className="text-sm text-[#4B5563] group-hover:text-[#111827] font-instrument">
                              {category.name}
                            </span>
                          </div>
                          <Badge variant="gray" size="sm">
                            {category.count}
                          </Badge>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Condition Filter */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h3 className="font-inter font-semibold text-[#111827] mb-3 text-sm">
                      Condition
                    </h3>
                    <div className="space-y-2">
                      {conditions.map((condition) => (
                        <label
                          key={condition.id}
                          className="flex items-center gap-2 cursor-pointer group"
                        >
                          <input
                            type="radio"
                            name="condition"
                            value={condition.id}
                            checked={filters.condition === condition.id}
                            onChange={(e) =>
                              handleFilterChange("condition", e.target.value)
                            }
                            className="w-4 h-4 text-[#7E22CE] border-gray-300 focus:ring-[#7E22CE]"
                          />
                          <span className="text-sm text-[#4B5563] group-hover:text-[#111827] font-instrument">
                            {condition.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range Filter */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h3 className="font-inter font-semibold text-[#111827] mb-3 text-sm">
                      Price Range
                    </h3>
                    <div className="space-y-3">
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-instrument focus:ring-2 focus:ring-[#7E22CE] focus:border-transparent outline-none"
                        />
                        <span className="text-[#4B5563]">-</span>
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-instrument focus:ring-2 focus:ring-[#7E22CE] focus:border-transparent outline-none"
                        />
                      </div>
                      <div className="text-xs text-[#4B5563] font-instrument">
                        ₦{filters.priceRange[0].toLocaleString()} - ₦
                        {filters.priceRange[1].toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Location Filter */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h3 className="font-inter font-semibold text-[#111827] mb-3 text-sm flex items-center gap-2">
                      <FaMapMarkerAlt className="text-[#14B8A6]" />
                      Location
                    </h3>
                    <div className="space-y-4">
                      {/* Campus Area Selection */}
                      <div>
                        <label className="text-xs text-[#6B7280] font-instrument mb-2 block">
                          Campus Area
                        </label>
                        <div className="space-y-2">
                          {locations.map((location) => (
                            <label
                              key={location.id}
                              className="flex items-center gap-2 cursor-pointer group"
                            >
                              <input
                                type="radio"
                                name="locationArea"
                                value={location.id}
                                checked={filters.locationArea === location.id}
                                onChange={(e) => {
                                  handleFilterChange("locationArea", e.target.value);
                                  handleFilterChange("locationSpecific", "all"); // Reset specific location
                                }}
                                className="w-4 h-4 text-[#7E22CE] border-gray-300 focus:ring-[#7E22CE]"
                              />
                              <span className="text-sm text-[#4B5563] group-hover:text-[#111827] font-instrument">
                                {location.name}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      {/* Specific Location Selection (shown when area is selected) */}
                      {specificLocationOptions.length > 0 && (
                        <div className="pt-3 border-t border-gray-100">
                          <label className="text-xs text-[#6B7280] font-instrument mb-2 block">
                            Specific Location
                          </label>
                          <div className="space-y-2 max-h-40 overflow-y-auto">
                            <label className="flex items-center gap-2 cursor-pointer group">
                              <input
                                type="radio"
                                name="locationSpecific"
                                value="all"
                                checked={filters.locationSpecific === "all"}
                                onChange={(e) =>
                                  handleFilterChange("locationSpecific", e.target.value)
                                }
                                className="w-4 h-4 text-[#7E22CE] border-gray-300 focus:ring-[#7E22CE]"
                              />
                              <span className="text-sm text-[#4B5563] group-hover:text-[#111827] font-instrument">
                                All in this area
                              </span>
                            </label>
                            {specificLocationOptions.map((location) => (
                              <label
                                key={location.id}
                                className="flex items-center gap-2 cursor-pointer group"
                              >
                                <input
                                  type="radio"
                                  name="locationSpecific"
                                  value={location.id}
                                  checked={filters.locationSpecific === location.id}
                                  onChange={(e) =>
                                    handleFilterChange("locationSpecific", e.target.value)
                                  }
                                  className="w-4 h-4 text-[#7E22CE] border-gray-300 focus:ring-[#7E22CE]"
                                />
                                <span className="text-sm text-[#4B5563] group-hover:text-[#111827] font-instrument">
                                  {location.name}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sort By */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h3 className="font-inter font-semibold text-[#111827] mb-3 text-sm flex items-center gap-2">
                      <FaSortAmountDown className="text-[#7E22CE]" />
                      Sort By
                    </h3>
                    <div className="space-y-2">
                      {sortOptions.map((option) => (
                        <label
                          key={option.id}
                          className="flex items-center gap-2 cursor-pointer group"
                        >
                          <input
                            type="radio"
                            name="sortBy"
                            value={option.id}
                            checked={filters.sortBy === option.id}
                            onChange={(e) =>
                              handleFilterChange("sortBy", e.target.value)
                            }
                            className="w-4 h-4 text-[#7E22CE] border-gray-300 focus:ring-[#7E22CE]"
                          />
                          <span className="text-sm text-[#4B5563] group-hover:text-[#111827] font-instrument">
                            {option.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Filter toggle button when hidden - Desktop */}
          {!showDesktopFilters && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setShowDesktopFilters(true)}
              className="hidden lg:flex items-center gap-2 px-4 py-3 bg-white border-2 border-[#7E22CE] rounded-lg hover:bg-[#7E22CE] hover:text-white text-[#7E22CE] transition-all font-inter font-medium sticky top-24 h-fit"
              title="Show filters"
            >
              <FaFilter />
              <span>Show Filters</span>
              {activeFiltersCount > 0 && (
                <Badge variant="primary" size="sm" rounded>
                  {activeFiltersCount}
                </Badge>
              )}
            </motion.button>
          )}

          {/* Mobile Filter Drawer */}
          <AnimatePresence>
            {showFilters && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowFilters(false)}
                  className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                />

                {/* Drawer */}
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white z-50 lg:hidden overflow-y-auto"
                >
                  <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                    <h2 className="text-lg font-inter font-bold text-[#111827] flex items-center gap-2">
                      <FaFilter className="text-[#7E22CE]" />
                      Filters
                      {activeFiltersCount > 0 && (
                        <Badge variant="primary" size="sm" rounded>
                          {activeFiltersCount}
                        </Badge>
                      )}
                    </h2>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <FaTimes className="text-[#4B5563]" />
                    </button>
                  </div>

                  <div className="p-4 space-y-6">
                    {/* Same filter content as desktop sidebar */}
                    {/* Category Filter */}
                    <div>
                      <h3 className="font-inter font-semibold text-[#111827] mb-3">
                        Category
                      </h3>
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <label
                            key={category.id}
                            className="flex items-center justify-between cursor-pointer group"
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="radio"
                                name="category-mobile"
                                value={category.id}
                                checked={filters.category === category.id}
                                onChange={(e) =>
                                  handleFilterChange("category", e.target.value)
                                }
                                className="w-4 h-4 text-[#7E22CE] border-gray-300 focus:ring-[#7E22CE]"
                              />
                              <span className="text-sm text-[#4B5563] group-hover:text-[#111827] font-instrument">
                                {category.name}
                              </span>
                            </div>
                            <Badge variant="gray" size="sm">
                              {category.count}
                            </Badge>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Condition Filter */}
                    <div>
                      <h3 className="font-inter font-semibold text-[#111827] mb-3">
                        Condition
                      </h3>
                      <div className="space-y-2">
                        {conditions.map((condition) => (
                          <label
                            key={condition.id}
                            className="flex items-center gap-2 cursor-pointer group"
                          >
                            <input
                              type="radio"
                              name="condition-mobile"
                              value={condition.id}
                              checked={filters.condition === condition.id}
                              onChange={(e) =>
                                handleFilterChange("condition", e.target.value)
                              }
                              className="w-4 h-4 text-[#7E22CE] border-gray-300 focus:ring-[#7E22CE]"
                            />
                            <span className="text-sm text-[#4B5563] group-hover:text-[#111827] font-instrument">
                              {condition.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Price Range Filter */}
                    <div>
                      <h3 className="font-inter font-semibold text-[#111827] mb-3">
                        Price Range
                      </h3>
                      <div className="space-y-3">
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-instrument focus:ring-2 focus:ring-[#7E22CE] focus:border-transparent outline-none"
                          />
                          <span className="text-[#4B5563]">-</span>
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-instrument focus:ring-2 focus:ring-[#7E22CE] focus:border-transparent outline-none"
                          />
                        </div>
                        <div className="text-xs text-[#4B5563] font-instrument">
                          ₦{filters.priceRange[0].toLocaleString()} - ₦
                          {filters.priceRange[1].toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Location Filter */}
                    <div>
                      <h3 className="font-inter font-semibold text-[#111827] mb-3 flex items-center gap-2">
                        <FaMapMarkerAlt className="text-[#14B8A6]" />
                        Location
                      </h3>
                      <div className="space-y-2">
                        {locations.map((location) => (
                          <label
                            key={location.id}
                            className="flex items-center gap-2 cursor-pointer group"
                          >
                            <input
                              type="radio"
                              name="location-mobile"
                              value={location.id}
                              checked={filters.location === location.id}
                              onChange={(e) =>
                                handleFilterChange("location", e.target.value)
                              }
                              className="w-4 h-4 text-[#7E22CE] border-gray-300 focus:ring-[#7E22CE]"
                            />
                            <span className="text-sm text-[#4B5563] group-hover:text-[#111827] font-instrument">
                              {location.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Sort By */}
                    <div>
                      <h3 className="font-inter font-semibold text-[#111827] mb-3 flex items-center gap-2">
                        <FaSortAmountDown className="text-[#7E22CE]" />
                        Sort By
                      </h3>
                      <div className="space-y-2">
                        {sortOptions.map((option) => (
                          <label
                            key={option.id}
                            className="flex items-center gap-2 cursor-pointer group"
                          >
                            <input
                              type="radio"
                              name="sortBy-mobile"
                              value={option.id}
                              checked={filters.sortBy === option.id}
                              onChange={(e) =>
                                handleFilterChange("sortBy", e.target.value)
                              }
                              className="w-4 h-4 text-[#7E22CE] border-gray-300 focus:ring-[#7E22CE]"
                            />
                            <span className="text-sm text-[#4B5563] group-hover:text-[#111827] font-instrument">
                              {option.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex gap-3">
                    <Button
                      variant="outline"
                      onClick={clearAllFilters}
                      fullWidth
                    >
                      Clear All
                    </Button>
                    <Button onClick={() => setShowFilters(false)} fullWidth>
                      Apply Filters
                    </Button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Results Grid */}
          <div className="flex-1 min-w-0">
            {/* Active filters badges */}
            {activeFiltersCount > 0 && (
              <div className="mb-4 flex items-center gap-2 flex-wrap">
                <span className="text-sm font-instrument text-[#4B5563]">
                  Active filters:
                </span>
                {filters.category !== "all" && (
                  <Badge variant="primary" className="flex items-center gap-1">
                    {categories.find((c) => c.id === filters.category)?.name}
                    <button
                      onClick={() => handleFilterChange("category", "all")}
                      className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  </Badge>
                )}
                {filters.condition !== "all" && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {conditions.find((c) => c.id === filters.condition)?.name}
                    <button
                      onClick={() => handleFilterChange("condition", "all")}
                      className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  </Badge>
                )}
                {filters.location !== "all" && (
                  <Badge variant="success" className="flex items-center gap-1">
                    <FaMapMarkerAlt className="text-xs" />
                    {locations.find((l) => l.id === filters.location)?.name}
                    <button
                      onClick={() => handleFilterChange("location", "all")}
                      className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  </Badge>
                )}
              </div>
            )}

            {/* Products grid */}
            {searchResults.length > 0 ? (
              <motion.div
                layout
                className={`grid gap-4 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {searchResults.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ProductCard
                      product={product}
                      onClick={() =>
                        navigate(`/dashboard/product/${product.id}`)
                      }
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FaSearch className="text-4xl text-[#4B5563]" />
                </div>
                <h3 className="text-xl font-inter font-bold text-[#111827] mb-2">
                  No products found
                </h3>
                <p className="text-[#4B5563] font-instrument mb-4 max-w-md">
                  Try adjusting your search or filters to find what you're
                  looking for.
                </p>
                <Button variant="outline" onClick={clearAllFilters}>
                  Clear All Filters
                </Button>
              </div>
            )}

            {/* Load more */}
            {searchResults.length > 0 && (
              <div className="flex justify-center mt-8">
                <Button variant="outline" size="lg">
                  Load More Results
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
