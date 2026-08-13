const fs = require('fs');
const path = require('path');
const os = require('os');
const { uploadMedia, getCloudinaryFolder } = require('../utils/cloudinary');

// POST /api/uploads/image
const uploadImage = async (req, res, next) => {
  let tempPath = null;
  try {
    const file = req.file || (req.files && req.files[0]);
    if (!file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const folderType = req.body.folder || 'site';
    const folder = getCloudinaryFolder(folderType);

    tempPath = path.join(os.tmpdir(), `upload_${Date.now()}_${file.originalname || 'image.jpg'}`);
    fs.writeFileSync(tempPath, file.buffer);

    const result = await uploadMedia(tempPath, folder);

    res.status(200).json({
      public_id: result.public_id,
      url: result.secure_url
    });
  } catch (error) {
    next(error);
  } finally {
    if (tempPath && fs.existsSync(tempPath)) {
      try {
        fs.unlinkSync(tempPath);
      } catch (err) {
        // ignore cleanup error
      }
    }
  }
};

module.exports = {
  uploadImage
};
