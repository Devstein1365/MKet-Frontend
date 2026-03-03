import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaTags } from "react-icons/fa";
import { categories as categoriesData } from "../../data/categories";

const CategoryGrid = () => {
  // Show 4 categories on mobile/tablet, 5 on desktop
  const [isMobile, setIsMobile] = React.useState(
    typeof window !== "undefined" && window.innerWidth < 1024,
  );

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const categoriesToShow = isMobile ? 4 : 5;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-inter font-bold text-[#111827] flex items-center gap-2">
          <FaTags className="text-[#7E22CE]" />
          Categories
        </h2>
        <Link
          to="/dashboard/categories"
          className="text-sm font-inter text-[#7E22CE] hover:text-[#6b1fb8] font-medium"
        >
          View All
        </Link>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3"
      >
        {categoriesData.slice(0, categoriesToShow).map((category) => (
          <motion.div
            key={category.id}
            variants={itemVariants}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to={`/dashboard/categories/${category.id}`}
              className="block p-4 bg-white rounded-lg border border-gray-200 hover:border-[#7E22CE] hover:shadow-md transition-all group"
            >
              <div className="text-3xl mb-2">
                {category.icon && <category.icon />}
              </div>
              <h3 className="font-inter font-semibold text-[#111827] text-sm group-hover:text-[#7E22CE] transition-colors">
                {category.name}
              </h3>
              <p className="text-xs text-[#4B5563] font-instrument mt-1">
                {category.count} items
              </p>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default CategoryGrid;
