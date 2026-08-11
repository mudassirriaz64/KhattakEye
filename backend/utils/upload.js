const multer = require("multer");

// Use memory storage so we can stream the buffer directly to our compression pipeline
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
    return cb(null, true);
  }
  return cb(new Error("Only image and video files are allowed"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 200 * 1024 * 1024, // 200 MB limit per file (max video size constraint)
  },
});

module.exports = upload;
