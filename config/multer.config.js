import multer from "multer";
import path from "path";
import gcs from "./gcs.config.js";
import dotenv from "dotenv";
dotenv.config();

// Storage configuration
let storage;

if (
  process.env.NODE_ENV === "production" ||
  process.env.USE_GOOGLE_CLOUD_STORAGE === "true"
) {
  // Use Google Cloud Storage with custom implementation
  if (gcs.storage && gcs.bucket) {
    storage = multer.memoryStorage(); // Store in memory first
  } else {
    console.warn(
      "Google Cloud Storage not available, falling back to local storage"
    );
    storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "./uploads/");
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(
          null,
          file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
        );
      },
    });
  }
} else {
  // For local development - use local storage
  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./uploads/");
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(
        null,
        file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
      );
    },
  });
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept all file types for now
    cb(null, true);
  },
});

export default upload;
