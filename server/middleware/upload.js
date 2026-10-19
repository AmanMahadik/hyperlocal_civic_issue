const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Readable } = require('stream');
const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');

// Ensure local uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Memory storage for multer
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and WebP images are allowed'), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
    files: 3
  },
  fileFilter
});

// Helper to save buffer either to Cloudinary or locally with automatic fallback
const saveImageBuffer = async (buffer, originalname, folder = 'pcmc_civic') => {
  if (isCloudinaryConfigured()) {
    try {
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            transformation: [{ width: 1280, height: 1280, crop: 'limit', quality: 'auto' }]
          },
          (error, result) => {
            if (error) return reject(error);
            resolve({
              url: result.secure_url,
              publicId: result.public_id
            });
          }
        );
        Readable.from(buffer).pipe(uploadStream);
      });
      return uploadResult;
    } catch (cloudinaryErr) {
      console.warn('[Cloudinary Error - Falling back to local disk storage]:', cloudinaryErr.message);
      // Fall through to local storage
    }
  }

  // Local file fallback
  const ext = path.extname(originalname) || '.jpg';
  const filename = `${folder}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`;
  const filePath = path.join(uploadsDir, filename);
  await fs.promises.writeFile(filePath, buffer);
  return {
    url: `/uploads/${filename}`,
    publicId: filename
  };
};

// Helper to remove images if needed
const removeImage = async (publicId) => {
  if (!publicId) return;
  if (isCloudinaryConfigured()) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (err) {
      console.error('Failed to delete Cloudinary image:', err.message);
    }
  } else {
    const filePath = path.join(uploadsDir, publicId);
    if (fs.existsSync(filePath)) {
      try {
        await fs.promises.unlink(filePath);
      } catch (err) {
        console.error('Failed to delete local image:', err.message);
      }
    }
  }
};

module.exports = {
  upload,
  saveImageBuffer,
  removeImage
};
