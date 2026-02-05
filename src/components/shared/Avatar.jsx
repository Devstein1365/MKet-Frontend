import React from "react";
import { FaUser } from "react-icons/fa";

const Avatar = ({
  src,
  alt = "User",
  name,
  size = "md",
  status,
  fallbackColor,
  className = "",
  onClick,
}) => {
  // Generate initials from name
  const getInitials = () => {
    if (!name) return null;

    const nameParts = name.trim().split(" ");
    if (nameParts.length === 1) {
      // Single word: use first 2 letters
      return nameParts[0].substring(0, 2).toUpperCase();
    }
    // Multiple words: use first letter of first and last name
    return (
      nameParts[0].charAt(0).toUpperCase() +
      nameParts[nameParts.length - 1].charAt(0).toUpperCase()
    );
  };

  const initials = getInitials();
  const sizes = {
    xs: "w-8 h-8 text-xs",
    sm: "w-10 h-10 text-sm",
    md: "w-12 h-12 text-base",
    lg: "w-16 h-16 text-lg",
    xl: "w-24 h-24 text-2xl",
    "2xl": "w-32 h-32 text-3xl",
  };

  const statusSizes = {
    xs: "w-2 h-2 border",
    sm: "w-2.5 h-2.5 border",
    md: "w-3 h-3 border-2",
    lg: "w-4 h-4 border-2",
    xl: "w-5 h-5 border-2",
    "2xl": "w-6 h-6 border-2",
  };

  const statusColors = {
    online: "bg-green-500",
    offline: "bg-gray-400",
    busy: "bg-red-500",
    away: "bg-yellow-500",
  };

  // Determine background style
  const bgStyle = fallbackColor ? { backgroundColor: fallbackColor } : {};

  return (
    <div
      className={`relative inline-block ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div
        className={`
          ${sizes[size]} rounded-full overflow-hidden
          ${!fallbackColor ? "bg-gradient-to-br from-[#7E22CE] to-[#14B8A6]" : ""}
          flex items-center justify-center text-white font-inter font-semibold
          ${onClick ? "cursor-pointer hover:opacity-90 transition-opacity" : ""}
        `}
        style={bgStyle}
      >
        {src ? (
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        ) : initials ? (
          <span>{initials}</span>
        ) : (
          <FaUser className="opacity-70" />
        )}
      </div>
      {status && (
        <span
          className={`
            absolute bottom-0 right-0 rounded-full border-white
            ${statusSizes[size]} ${statusColors[status]}
          `}
        />
      )}
    </div>
  );
};

export default Avatar;
