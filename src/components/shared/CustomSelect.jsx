import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaCheck } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const CustomSelect = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  error,
  required = false,
  icon: Icon,
  name,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Find selected option
  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (optionValue) => {
    onChange({ target: { name, value: optionValue } });
    setIsOpen(false);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-inter font-medium text-[#111827] mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative" ref={dropdownRef}>
        {/* Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-4 py-3 border rounded-lg font-instrument text-left flex items-center justify-between transition-all ${
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-[#7E22CE]"
          } ${
            isOpen ? "ring-2 ring-[#7E22CE] border-transparent" : ""
          } hover:border-[#7E22CE] bg-white`}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {Icon && <Icon className="text-[#7E22CE] flex-shrink-0" />}
            <span
              className={`truncate ${
                selectedOption ? "text-[#111827]" : "text-[#9CA3AF]"
              }`}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
          <FaChevronDown
            className={`text-[#4B5563] ml-2 flex-shrink-0 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto"
            >
              {options.length === 0 ? (
                <div className="px-4 py-3 text-sm text-[#9CA3AF] font-instrument">
                  No options available
                </div>
              ) : (
                options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`w-full px-4 py-3 text-left font-instrument transition-all flex items-center justify-between hover:bg-[#7E22CE]/5 ${
                      option.value === value
                        ? "bg-[#7E22CE]/10 text-[#7E22CE] font-medium"
                        : "text-[#111827]"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {option.icon && (
                        <span className="text-lg">
                          {typeof option.icon === "function" ? (
                            <option.icon />
                          ) : (
                            option.icon
                          )}
                        </span>
                      )}
                      {option.label}
                    </span>
                    {option.value === value && (
                      <FaCheck className="text-[#7E22CE]" />
                    )}
                  </button>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-1 font-instrument">{error}</p>
      )}
    </div>
  );
};

export default CustomSelect;
