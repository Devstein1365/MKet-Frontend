import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight, FaSearch } from "react-icons/fa";
import { categories } from "../../data/categories";
import Card from "../../components/shared/Card";

const Categories = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter categories based on search
  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#7E22CE] to-[#14B8A6] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-inter font-bold mb-4">
              Browse Categories
            </h1>
            <p className="text-lg text-white/90 font-instrument mb-6">
              Explore products by category and find exactly what you need
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search categories..."
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50 font-instrument"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg font-instrument">
              No categories found matching "{searchQuery}"
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link to={`/dashboard/categories/${category.id}`}>
                  <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer group h-full">
                    <div className="flex flex-col items-center text-center p-4">
                      {/* Icon */}
                      <div
                        className="w-20 h-20 rounded-full flex items-center justify-center mb-4 text-4xl group-hover:scale-110 transition-transform duration-300"
                        style={{ backgroundColor: `${category.color}15` }}
                      >
                        {category.icon && <category.icon />}
                      </div>

                      {/* Category Name */}
                      <h3
                        className="text-lg font-inter font-bold mb-2 group-hover:text-[#7E22CE] transition-colors"
                        style={{ color: category.color }}
                      >
                        {category.name}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-gray-600 font-instrument mb-4">
                        {category.description}
                      </p>

                      {/* Browse Button */}
                      <div className="flex items-center gap-2 text-sm font-instrument font-medium text-[#7E22CE] group-hover:gap-3 transition-all">
                        Browse
                        <FaArrowRight className="text-xs" />
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Total Categories */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 font-instrument">
            Showing {filteredCategories.length} of {categories.length}{" "}
            categories
          </p>
        </div>
      </div>
    </div>
  );
};

export default Categories;
