import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaSearch, FaTimes, FaSpinner } from "react-icons/fa";
import Input from "../shared/Input";
import Button from "../shared/Button";

const SearchBar = ({
  searchInput,
  setSearchInput,
  handleKeyPress,
  clearSearch,
  performSearch,
  searchLoading,
  showSuggestions,
  setShowSuggestions,
  suggestions,
  handleSuggestionClick,
  searchRef,
  isMobile = false,
}) => {
  return (
    <div
      className={`flex items-center gap-2 ${
        isMobile ? "w-full" : "flex-1 max-w-2xl mx-auto"
      }`}
    >
      <div
        className={`${isMobile ? "flex-1" : "flex-1"} relative`}
        ref={searchRef}
      >
        <Input
          type="text"
          placeholder={
            isMobile
              ? "Search products..."
              : "Search for products, sellers, categories..."
          }
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() =>
            searchInput.length >= 2 &&
            setShowSuggestions &&
            setShowSuggestions(true)
          }
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

        {/* Suggestions Dropdown */}
        <AnimatePresence>
          {showSuggestions &&
            (suggestions.products.length > 0 ||
              suggestions.categories.length > 0) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden max-h-96 overflow-y-auto z-50"
              >
                {/* Categories */}
                {suggestions.categories.length > 0 && (
                  <div className="border-b border-gray-100">
                    <div className="px-4 py-2 bg-gray-50">
                      <p className="text-xs font-semibold text-gray-500 uppercase">
                        Categories
                      </p>
                    </div>
                    {suggestions.categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() =>
                          handleSuggestionClick(category, "category")
                        }
                        className="w-full px-4 py-3 hover:bg-purple-50 transition-colors text-left flex items-center gap-3"
                      >
                        <span className="text-2xl">
                          {category.icon && <category.icon />}
                        </span>
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

                {/* Products */}
                {suggestions.products.length > 0 && (
                  <div>
                    <div className="px-4 py-2 bg-gray-50">
                      <p className="text-xs font-semibold text-gray-500 uppercase">
                        Products
                      </p>
                    </div>
                    {suggestions.products.map((product) => (
                      <button
                        key={product.id}
                        onClick={() =>
                          handleSuggestionClick(product, "product")
                        }
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

                {/* Hint */}
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                  <p className="text-xs text-gray-500 text-center">
                    Press{" "}
                    <kbd className="px-2 py-1 bg-white rounded border border-gray-300 font-mono">
                      Enter
                    </kbd>{" "}
                    to search
                  </p>
                </div>
              </motion.div>
            )}
        </AnimatePresence>
      </div>

      <Button
        onClick={performSearch}
        disabled={searchLoading || !searchInput.trim()}
        size={isMobile ? "sm" : "md"}
      >
        {searchLoading ? (
          <FaSpinner className="animate-spin" />
        ) : isMobile ? (
          <FaSearch />
        ) : (
          "Search"
        )}
      </Button>
    </div>
  );
};

export default SearchBar;
