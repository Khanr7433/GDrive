import express from "express";
import authMiddleware from "../middlewares/auth.js";
import gcs from "../config/gcs.config.js";
import fs from "fs";
import path from "path";

const router = express.Router();
import upload from "../config/multer.config.js";
import fileModel from "../models/files.models.js";

// Landing page route
router.get("/", (req, res) => {
  res.render("sitehome");
});

router.get("/home", authMiddleware, async (req, res) => {
  try {
    const userFiles = await fileModel.find({
      user: req.user.userId,
    });

    console.log(userFiles);

    // Get message from query parameter
    const message = req.query.message || null;

    // Helper function to format file size
    const formatFileSize = (bytes) => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    res.render("home", {
      files: userFiles,
      message: message,
      formatFileSize: formatFileSize,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  async (req, res) => {
    try {
      const isGoogleCloudStorage =
        process.env.USE_GOOGLE_CLOUD_STORAGE === "true" &&
        (process.env.NODE_ENV === "production" ||
          process.env.USE_GOOGLE_CLOUD_STORAGE === "true");

      let filePath;
      let cloudStorageUrl = null;
      let cloudStorageObject = null;

      if (isGoogleCloudStorage && gcs.bucket && req.file.buffer) {
        try {
          // Upload to Google Cloud Storage
          const filename =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1e9) +
            path.extname(req.file.originalname);
          const blob = gcs.bucket.file(`uploads/${filename}`);

          const blobStream = blob.createWriteStream({
            metadata: {
              contentType: req.file.mimetype,
            },
          });

          await new Promise((resolve, reject) => {
            blobStream.on("error", reject);
            blobStream.on("finish", resolve);
            blobStream.end(req.file.buffer);
          });

          filePath = `uploads/${filename}`;
          cloudStorageUrl = `https://storage.googleapis.com/${process.env.GOOGLE_CLOUD_STORAGE_BUCKET}/${filePath}`;
          cloudStorageObject = filename;
        } catch (gcsError) {
          console.error(
            "Google Cloud Storage upload failed:",
            gcsError.message
          );

          // If there's a local file created by multer, delete it
          if (req.file && req.file.path && fs.existsSync(req.file.path)) {
            try {
              fs.unlinkSync(req.file.path);
              console.log("Cleaned up local file after GCS upload failure");
            } catch (deleteError) {
              console.error("Error deleting local file:", deleteError.message);
            }
          }

          // Throw error to stop the upload process
          throw new Error(
            `Google Cloud Storage upload failed: ${gcsError.message}. Please try again.`
          );
        }
      } else {
        // Use local file path
        filePath = req.file.path;
      }

      const newFile = await fileModel.create({
        path: filePath,
        originalname: req.file.originalname,
        user: req.user.userId,
        size: req.file.size,
        mimetype: req.file.mimetype,
        cloudStorageUrl: cloudStorageUrl,
        cloudStorageObject: cloudStorageObject,
        isGoogleCloudStorage: isGoogleCloudStorage && !!cloudStorageUrl,
      });

      res.redirect(
        `/home?message=File "${req.file.originalname}" uploaded successfully!`
      );
    } catch (error) {
      console.error("Upload error:", error);
      res.redirect(`/home?message=Error uploading file: ${error.message}`);
    }
  }
);

router.get("/download/:path", authMiddleware, async (req, res) => {
  try {
    console.log(req.params, req.user);

    const loggedInUserId = req.user.userId;
    const filePath = req.params.path;

    const file = await fileModel.findOne({
      user: loggedInUserId,
      path: filePath,
    });

    console.log(file);

    if (!file) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // Check if file is stored in Google Cloud Storage
    if (file.isGoogleCloudStorage && file.cloudStorageUrl) {
      // For Google Cloud Storage files, redirect to the public URL
      res.redirect(file.cloudStorageUrl);
    } else {
      // For local files, serve directly
      const fullPath = path.resolve(filePath);

      if (fs.existsSync(fullPath)) {
        res.download(fullPath, file.originalname);
      } else {
        res.status(404).json({
          message: "File not found",
        });
      }
    }
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({
      message: "Error downloading file",
      error: error.message,
    });
  }
});

export default router;
