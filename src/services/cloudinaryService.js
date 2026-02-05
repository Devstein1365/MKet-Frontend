// Cloudinary Upload Service

const CLOUDINARY_CLOUD_NAME = "daxxf6eal";
const CLOUDINARY_UPLOAD_PRESET = "mket_uploads"; // You'll need to create this in Cloudinary

class CloudinaryService {
  /**
   * Upload single image to Cloudinary
   * @param {File} file - The image file to upload
   * @param {Function} onProgress - Callback for upload progress (0-100)
   * @returns {Promise<Object>} - { success, public_id, url, error }
   */
  async uploadImage(file, onProgress) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      formData.append("folder", "mket/products");

      const xhr = new XMLHttpRequest();

      return new Promise((resolve, reject) => {
        // Track upload progress
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable && onProgress) {
            const percentComplete = Math.round((e.loaded / e.total) * 100);
            onProgress(percentComplete);
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            resolve({
              success: true,
              public_id: response.public_id,
              url: response.secure_url,
              width: response.width,
              height: response.height,
            });
          } else {
            reject(new Error("Upload failed"));
          }
        });

        xhr.addEventListener("error", () => {
          reject(new Error("Upload failed"));
        });

        xhr.open(
          "POST",
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        );
        xhr.send(formData);
      });
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      return {
        success: false,
        error: error.message || "Failed to upload image",
      };
    }
  }

  /**
   * Upload multiple images to Cloudinary
   * @param {FileList|Array} files - Array of image files
   * @param {Function} onProgress - Callback for overall progress
   * @returns {Promise<Array>} - Array of upload results {public_id, url}
   */
  async uploadMultipleImages(files, onProgress) {
    const filesArray = Array.from(files);
    const uploadedImages = [];
    let completedCount = 0;

    for (const file of filesArray) {
      try {
        const result = await this.uploadImage(file, (fileProgress) => {
          // Calculate overall progress
          const overallProgress =
            ((completedCount + fileProgress / 100) / filesArray.length) * 100;
          if (onProgress) {
            onProgress(Math.round(overallProgress));
          }
        });

        if (result.success && result.url) {
          uploadedImages.push({
            public_id: result.public_id,
            url: result.url,
          });
        } else {
          throw new Error(result.error || "Upload failed");
        }

        completedCount++;

        if (onProgress) {
          onProgress(Math.round((completedCount / filesArray.length) * 100));
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        completedCount++;
        throw error; // Throw error to be caught in PostItem
      }
    }

    return uploadedImages;
  }

  /**
   * Delete image from Cloudinary
   * Note: This requires backend API call with admin credentials
   * For now, we'll just return success (backend will handle deletion)
   */
  async deleteImage(publicId) {
    // This should be called from backend for security
    console.log("Image deletion should be handled by backend:", publicId);
    return {
      success: true,
      message: "Image will be deleted from backend",
    };
  }

  /**
   * Generate Cloudinary transformation URL
   * @param {String} url - Original Cloudinary URL
   * @param {Object} options - Transformation options
   * @returns {String} - Transformed URL
   */
  getTransformedUrl(url, options = {}) {
    if (!url || !url.includes("cloudinary.com")) {
      return url;
    }

    const {
      width,
      height,
      crop = "fill",
      quality = "auto",
      format = "auto",
    } = options;

    // Extract the upload part of the URL
    const uploadIndex = url.indexOf("/upload/");
    if (uploadIndex === -1) return url;

    const transformations = [];
    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    transformations.push(`c_${crop}`);
    transformations.push(`q_${quality}`);
    transformations.push(`f_${format}`);

    const transformString = transformations.join(",");
    return url.replace("/upload/", `/upload/${transformString}/`);
  }

  /**
   * Get thumbnail URL
   */
  getThumbnailUrl(url, size = 200) {
    return this.getTransformedUrl(url, {
      width: size,
      height: size,
      crop: "fill",
      quality: "auto",
    });
  }

  /**
   * Validate image file
   */
  validateImage(file) {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const maxSize = 10 * 1024 * 1024; // 10MB

    console.log(
      "Validating image:",
      file.name,
      file.type,
      `${(file.size / 1024 / 1024).toFixed(2)}MB`,
    );

    if (!validTypes.includes(file.type)) {
      return {
        isValid: false,
        error: "Please upload a valid image file (JPEG, PNG, or WebP)",
      };
    }

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `Image size must be less than 10MB (current: ${(file.size / 1024 / 1024).toFixed(2)}MB)`,
      };
    }

    return { isValid: true };
  }
}

export default new CloudinaryService();
