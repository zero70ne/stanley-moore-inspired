const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const processImage = async (buffer, filename) => {
  const outputPath = path.join(__dirname, '../uploads/products', filename);
  
  // Simple file write without Sharp processing for deployment
  fs.writeFileSync(outputPath, buffer);
    
  return `/uploads/products/${filename}`;
};

module.exports = { upload, processImage };