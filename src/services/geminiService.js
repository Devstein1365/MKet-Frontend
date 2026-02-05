// Google Gemini AI Service for Product Description Generation
// Now using backend API for security (API key hidden)

import api from "./api";

/**
 * Generate product description using Google Gemini AI (via backend)
 * @param {Object} productData - Product information
 * @param {string} productData.title - Product title
 * @param {string} productData.category - Product category
 * @param {string} productData.condition - Product condition (New, Used, Fairly Used)
 * @param {string} productData.price - Product price
 * @param {string} productData.location - Product location
 * @returns {Promise<string>} Generated description
 */
export const generateProductDescription = async (productData) => {
  try {
    const { title, category, condition, price, location } = productData;

    // Validate required fields
    if (!title || !category || !condition || !price) {
      throw new Error("Missing required fields");
    }

    // Call backend API
    const response = await api.post("/ai/generate-description", {
      title,
      category,
      condition,
      price,
      location,
    });

    if (response.data.success) {
      return response.data.description;
    } else {
      throw new Error(
        response.data.message || "Failed to generate description",
      );
    }
  } catch (error) {
    console.error("Gemini API Error:", error);

    // Return a fallback description
    const fallbackDescription = `${productData.condition} ${productData.category} item available at ${productData.location || "FUTMINNA Campus"}. Contact seller for more details.`;

    return fallbackDescription;
  }
};

/**
 * Check if AI service is available
 * @returns {Promise<boolean>} True if AI service is configured
 */
export const checkAIAvailability = async () => {
  try {
    const response = await api.get("/ai/health");
    return response.data.configured;
  } catch (error) {
    console.error("AI Health Check Error:", error);
    return false;
  }
};

export default {
  generateProductDescription,
  checkAIAvailability,
};
