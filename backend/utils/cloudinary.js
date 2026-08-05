const cloudinary = require('cloudinary').v2;

// These would normally be configured via env variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Get the standardized Cloudinary folder path based on resource type.
 * @param {string} resourceType - products, categories, brands, etc.
 * @param {string} [subType] - optional subtype, e.g., images or videos
 * @returns {string} - The folder path, e.g., khattak-eye/products/images
 */
const getCloudinaryFolder = (resourceType, subType = null) => {
  const base = 'khattak-eye';
  if (subType) {
    return `${base}/${resourceType}/${subType}`;
  }
  return `${base}/${resourceType}`;
};

/**
 * Resolves a Cloudinary public_id into a full delivery URL.
 * @param {string} publicId - The Cloudinary public_id
 * @param {object} [options] - Optional Cloudinary transformation options
 * @returns {string|null} - The full URL or null if no publicId provided
 */
const resolveImageUrl = (publicId, options = {}) => {
  if (!publicId) return null;
  // If it's already a full URL (e.g. from early mock data that hasn't been cleaned), return it
  if (publicId.startsWith('http')) return publicId;
  
  // Construct the Cloudinary URL using the configured cloud_name
  return cloudinary.url(publicId, {
    secure: true,
    ...options
  });
};

/**
 * Uploads a file to Cloudinary.
 * @param {string} filePath - Path to the local (compressed) file
 * @param {string} folder - The Cloudinary folder to upload to
 * @param {object} [options] - Additional Cloudinary upload options
 * @returns {Promise<object>} - The upload result containing public_id
 */
const uploadMedia = async (filePath, folder, options = {}) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      ...options
    });
    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

module.exports = {
  cloudinary,
  getCloudinaryFolder,
  resolveImageUrl,
  uploadMedia
};
