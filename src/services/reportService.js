import api from "./api";

// Report Service - Connected to Backend API

class ReportService {
  // Report a user
  async reportUser(reportedUserId, reason, description) {
    try {
      const response = await api.post("/reports", {
        reportedUserId,
        reason,
        description,
      });

      return {
        success: true,
        message: response.data.message || "Report submitted successfully",
        report: response.data.report,
      };
    } catch (error) {
      console.error("Report user error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to submit report",
      };
    }
  }

  // Report a product
  async reportProduct(reportedProductId, reason, description) {
    try {
      const response = await api.post("/reports", {
        reportedProductId,
        reason,
        description,
      });

      return {
        success: true,
        message: response.data.message || "Report submitted successfully",
        report: response.data.report,
      };
    } catch (error) {
      console.error("Report product error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to submit report",
      };
    }
  }

  // Get my reports
  async getMyReports() {
    try {
      const response = await api.get("/reports");

      return {
        success: true,
        reports: response.data.reports || [],
      };
    } catch (error) {
      console.error("Get reports error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to load reports",
        reports: [],
      };
    }
  }
}

// Create and export singleton instance
const reportService = new ReportService();
export default reportService;
