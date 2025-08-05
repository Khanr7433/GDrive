const multer = require("multer");
const { Storage } = require('@google-cloud/storage');
const path = require('path');

// For local storage (default for development)
const localStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// Google Cloud Storage configuration (for production)
// Uncomment and configure when you have Google Cloud credentials
/*
const gcs = new Storage({
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE // path to your service account key file
});

const bucket = gcs.bucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET);

const gcsStorage = multer.memoryStorage();
*/

// Use local storage by default
const upload = multer({
  storage: localStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept all file types for now
    cb(null, true);
  }
});

// For Google Cloud Storage upload (uncomment when configured)
/*
const uploadToGCS = multer({
    storage: gcsStorage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    }
});
*/

module.exports = upload;
