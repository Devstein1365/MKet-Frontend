import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaBell, FaSlidersH } from "react-icons/fa";
import Button from "../../components/shared/Button";
import SearchBar from "../../components/dashboard/SearchBar";
import FilterPanel from "../../components/dashboard/FilterPanel";
import CategoryGrid from "../../components/dashboard/CategoryGrid";
import ProductsSection from "../../components/dashboard/ProductsSection";
import NotificationDropdown from "../../components/dashboard/NotificationDropdown";
import productsService from "../../services/productsService";
import notificationsService from "../../services/notificationsService";
import { categories as categoriesData } from "../../data/categories";

const DashboardHome = () => {
  const [searchQuery, setSearchQuery] = useState(""); // Committed search query
  const [searchInput, setSearchInput] = useState(""); // What user is typing
  const [hasSearched, setHasSearched] = useState(false); // Has user performed a search
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState({
    products: [],
    categories: [],
  });
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showDesktopFilters, setShowDesktopFilters] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filters, setFilters] = useState({
    category: "all",
    condition: "all",
    priceRange: [0, 1000000],
    location: "all",
    sortBy: "relevance",
    status: "all",
  });

  const searchRef = useRef(null);
  const suggestionTimeoutRef = useRef(null);

  // Load all products on mount
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const result = await productsService.getAllProducts();
        console.log("Dashboard products loaded:", result);

        if (result.success && result.products) {
          setProducts(result.products);
          setFilteredProducts(result.products);
        } else {
          console.error("Failed to load products:", result.message);
          setProducts([]);
          setFilteredProducts([]);
        }
      } catch (error) {
        console.error("Error loading products:", error);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  // Load unread notifications count
  const loadUnreadCount = async () => {
    try {
      const result = await notificationsService.getUnreadCount();
      if (result.success) {
        setUnreadCount(result.unreadCount || 0);
      }
    } catch (error) {
      console.error("Error loading unread count:", error);
    }
  };

  useEffect(() => {
    loadUnreadCount();
  }, []);

  // Generate suggestions as user types (NO auto-search)
  useEffect(() => {
    if (suggestionTimeoutRef.current) {
      clearTimeout(suggestionTimeoutRef.current);
    }

    if (searchInput.trim().length < 2) {
      setSuggestions({ products: [], categories: [] });
      setShowSuggestions(false);
      return;
    }

    suggestionTimeoutRef.current = setTimeout(() => {
      const query = searchInput.toLowerCase().trim();

      // Get matching products (limit to 5 for suggestions)
      const matchingProducts = products
        .filter(
          (product) =>
            product.title.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query),
        )
        .slice(0, 5);

      // Get matching categories
      const matchingCategories = categoriesData
        .filter((cat) => cat.name.toLowerCase().includes(query))
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
  }, [searchInput, products]);

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

  // Apply filters to search results AFTER search
  useEffect(() => {
    const hasActiveFilters =
      filters.category !== "all" ||
      filters.condition !== "all" ||
      filters.location !== "all" ||
      filters.sortBy !== "relevance" ||
      filters.status !== "all" ||
      filters.priceRange[0] !== 0 ||
      filters.priceRange[1] !== 1000000;

    if (hasSearched || hasActiveFilters) {
      performSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // Perform actual search
  const performSearch = async () => {
    const query = searchInput.trim();

    setSearchLoading(true);
    setHasSearched(true);
    setShowSuggestions(false);
    setSearchQuery(query);

    try {
      // Use the new server-side filtering for better performance and accuracy
      const result = await productsService.searchProducts(
        query,
        {
          ...filters,
          minPrice: filters.priceRange[0],
          maxPrice: filters.priceRange[1],
          sort: filters.sortBy,
          status: filters.status,
        },
        1,
        50,
      );
      console.log("Search result:", result);

      if (result.success && result.products) {
        setFilteredProducts(result.products);
      } else {
        setFilteredProducts([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setFilteredProducts([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      performSearch();
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = async (suggestion, type) => {
    if (type === "product") {
      setSearchInput(suggestion.title);
      setShowSuggestions(false);
      setSearchQuery(suggestion.title);
      setHasSearched(true);
      setSearchLoading(true);

      try {
        const result = await productsService.searchProducts(
          suggestion.title,
          {
            ...filters,
            minPrice: filters.priceRange[0],
            maxPrice: filters.priceRange[1],
            sort: filters.sortBy,
            status: filters.status,
          },
          1,
          50,
        );
        if (result.success && result.products) {
          setFilteredProducts(result.products);
        } else {
          setFilteredProducts([]);
        }
      } catch (error) {
        console.error("Search error:", error);
        setFilteredProducts([]);
      } finally {
        setSearchLoading(false);
      }
    } else if (type === "category") {
      const newFilters = { ...filters, category: suggestion.id };
      setSearchInput(suggestion.name);
      setFilters(newFilters);
      setShowSuggestions(false);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      category: "all",
      condition: "all",
      priceRange: [0, 1000000],
      location: "all",
      sortBy: "relevance",
      status: "all",
    });
    setSearchQuery("");
    setSearchInput("");
    setHasSearched(false);
    setFilteredProducts(products); // Show all products
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearchQuery("");
    setHasSearched(false);
    setSuggestions({ products: [], categories: [] });
    setShowSuggestions(false);
    setFilteredProducts(products); // Show all products
  };

  const activeFiltersCount = Object.values(filters).filter(
    (value) =>
      value !== "all" && value !== "relevance" && value !== filters.priceRange,
  ).length;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between py-4">
            {/* Logo - visible on mobile only */}
            <div className="lg:hidden mb-3 w-full flex items-center justify-between">
              <h1 className="text-2xl font-zen font-bold bg-linear-to-r from-[#7E22CE] to-[#14B8A6] text-transparent bg-clip-text">
                MKET
              </h1>

              {/* Mobile actions */}
              <div className="flex items-center gap-2">
                {hasSearched && (
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="p-2 rounded-lg border-2 border-gray-200 hover:border-[#7E22CE] transition-colors relative"
                  >
                    <FaSlidersH className="text-[#7E22CE]" />
                    {activeFiltersCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#7E22CE] text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>
                )}

                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <FaBell className="text-xl text-[#4B5563]" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                  </button>
                  <NotificationDropdown
                    isOpen={showNotifications}
                    onClose={() => setShowNotifications(false)}
                    onUpdateCount={loadUnreadCount}
                  />
                </div>
              </div>
            </div>

            {/* Centered Search bar - both desktop and mobile */}
            <div className="w-full lg:flex-1 lg:flex lg:justify-center">
              <div className="lg:max-w-3xl lg:w-full">
                <SearchBar
                  searchInput={searchInput}
                  setSearchInput={setSearchInput}
                  handleKeyPress={handleKeyPress}
                  clearSearch={clearSearch}
                  performSearch={performSearch}
                  searchLoading={searchLoading}
                  showSuggestions={showSuggestions}
                  setShowSuggestions={setShowSuggestions}
                  suggestions={suggestions}
                  handleSuggestionClick={handleSuggestionClick}
                  searchRef={searchRef}
                  isMobile={false}
                />
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3 ml-4">
              {/* Filter button - Only show after search */}
              {hasSearched && (
                <button
                  onClick={() => setShowDesktopFilters(!showDesktopFilters)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-gray-200 hover:border-[#7E22CE] transition-colors relative"
                >
                  <FaSlidersH className="text-[#7E22CE]" />
                  {activeFiltersCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#7E22CE] text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              )}

              <Link to="/dashboard/post">
                <Button icon={<FaPlus />} iconPosition="left" size="md">
                  Post Item
                </Button>
              </Link>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <FaBell className="text-xl text-[#4B5563]" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
                <NotificationDropdown
                  isOpen={showNotifications}
                  onClose={() => setShowNotifications(false)}
                  onUpdateCount={loadUnreadCount}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Desktop Filter Sidebar */}
          {hasSearched && (
            <FilterPanel
              filters={filters}
              handleFilterChange={handleFilterChange}
              clearAllFilters={clearAllFilters}
              activeFiltersCount={activeFiltersCount}
              showDesktopFilters={showDesktopFilters}
              isMobile={false}
            />
          )}

          {/* Mobile Filter Overlay */}
          {hasSearched && (
            <FilterPanel
              filters={filters}
              handleFilterChange={handleFilterChange}
              clearAllFilters={clearAllFilters}
              activeFiltersCount={activeFiltersCount}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              isMobile={true}
            />
          )}

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* Categories - Only show before search */}
            {!hasSearched && <CategoryGrid />}

            {/* Products Section */}
            <ProductsSection
              products={filteredProducts}
              loading={loading}
              hasSearched={hasSearched}
              searchQuery={searchQuery}
              activeFiltersCount={activeFiltersCount}
              clearAllFilters={clearAllFilters}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
