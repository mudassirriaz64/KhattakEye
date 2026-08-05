const multer = require("multer");

// Use memory storage so we can stream the buffer directly to our compression pipeline
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Accept images only for now
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit per file
  },
});

module.exports = upload;
