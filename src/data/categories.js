import {
  FaMobileAlt,
  FaCouch,
  FaBook,
  FaTshirt,
  FaFootballBall,
  FaHome,
  FaSpa,
  FaBicycle,
  FaUtensils,
  FaTools,
  FaGuitar,
  FaBox,
} from "react-icons/fa";

// Categories data for MKET
export const categories = [
  {
    id: "electronics",
    name: "Electronics",
    icon: FaMobileAlt,
    description: "Phones, laptops, gadgets, and accessories",
    color: "#7E22CE", // Purple
  },
  {
    id: "furniture",
    name: "Furniture",
    icon: FaCouch,
    description: "Beds, chairs, tables, and home furniture",
    color: "#14B8A6", // Teal
  },
  {
    id: "books",
    name: "Books & Stationery",
    icon: FaBook,
    description: "Textbooks, novels, notes, and stationery",
    color: "#F59E0B", // Amber
  },
  {
    id: "fashion",
    name: "Fashion & Clothing",
    icon: FaTshirt,
    description: "Clothes, shoes, bags, and accessories",
    color: "#EC4899", // Pink
  },
  {
    id: "sports",
    name: "Sports & Fitness",
    icon: FaFootballBall,
    description: "Sports equipment, gym gear, and accessories",
    color: "#10B981", // Green
  },
  {
    id: "home",
    name: "Home & Kitchen",
    icon: FaHome,
    description: "Kitchen items, utensils, and home decor",
    color: "#EF4444", // Red
  },
  {
    id: "beauty",
    name: "Beauty & Personal Care",
    icon: FaSpa,
    description: "Cosmetics, skincare, and personal care items",
    color: "#8B5CF6", // Violet
  },
  {
    id: "vehicles",
    name: "Vehicles & Parts",
    icon: FaBicycle,
    description: "Bicycles, motorcycles, and vehicle accessories",
    color: "#3B82F6", // Blue
  },
  {
    id: "food",
    name: "Food & Groceries",
    icon: FaUtensils,
    description: "Snacks, groceries, and food items",
    color: "#F97316", // Orange
  },
  {
    id: "services",
    name: "Services",
    icon: FaTools,
    description: "Repair, tutoring, and other services",
    color: "#6366F1", // Indigo
  },
  {
    id: "music",
    name: "Music & Instruments",
    icon: FaGuitar,
    description: "Musical instruments and audio equipment",
    color: "#A855F7", // Purple
  },
  {
    id: "other",
    name: "Other",
    icon: FaBox,
    description: "Miscellaneous items",
    color: "#6B7280", // Gray
  },
];

// Get category by ID
export const getCategoryById = (id) => {
  return categories.find((cat) => cat.id === id);
};

// Get category name by ID
export const getCategoryName = (id) => {
  const category = getCategoryById(id);
  return category ? category.name : "Unknown";
};

// Get category icon by ID
export const getCategoryIcon = (id) => {
  const category = getCategoryById(id);
  return category ? category.icon : FaBox;
};

// Get category color by ID
export const getCategoryColor = (id) => {
  const category = getCategoryById(id);
  return category ? category.color : "#6B7280";
};
