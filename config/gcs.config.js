import { Storage } from "@google-cloud/storage";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

// Initialize Google Cloud Storage
let storage;

try {
  if (
    process.env.GOOGLE_CLOUD_PROJECT_ID &&
    process.env.GOOGLE_CLOUD_KEY_FILE
  ) {
    // Using service account key file
    console.log(
      "Attempting to use service account key file:",
      process.env.GOOGLE_CLOUD_KEY_FILE
    );

    // Check if file exists
    if (!fs.existsSync(process.env.GOOGLE_CLOUD_KEY_FILE)) {
      throw new Error(
        `Service account key file not found: ${process.env.GOOGLE_CLOUD_KEY_FILE}`
      );
    }

    storage = new Storage({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE,
    });
  } else if (
    process.env.GOOGLE_CLOUD_PROJECT_ID &&
    process.env.GOOGLE_CLOUD_PRIVATE_KEY &&
    process.env.GOOGLE_CLOUD_CLIENT_EMAIL
  ) {
    // Using environment variables
    console.log(
      "Attempting to use environment variables for GCS authentication"
    );

    // Validate private key format
    const privateKey = process.env.GOOGLE_CLOUD_PRIVATE_KEY.replace(
      /\\n/g,
      "\n"
    );

    if (
      !privateKey.includes("-----BEGIN PRIVATE KEY-----") ||
      !privateKey.includes("-----END PRIVATE KEY-----")
    ) {
      throw new Error(
        "Invalid private key format. Must include BEGIN and END markers."
      );
    }

    storage = new Storage({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      credentials: {
        client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
        private_key: privateKey,
      },
    });
  } else {
    console.warn(
      "Google Cloud Storage credentials not configured. Using local storage only."
    );
    console.warn("Required environment variables:");
    console.warn("- GOOGLE_CLOUD_PROJECT_ID");
    console.warn(
      "- Either GOOGLE_CLOUD_KEY_FILE or (GOOGLE_CLOUD_PRIVATE_KEY + GOOGLE_CLOUD_CLIENT_EMAIL)"
    );
    storage = null;
  }

  if (storage) {
    console.log("Google Cloud Storage initialized successfully");

    // Validate bucket configuration
    if (!process.env.GOOGLE_CLOUD_STORAGE_BUCKET) {
      console.warn("GOOGLE_CLOUD_STORAGE_BUCKET not configured");
      storage = null;
    } else {
      console.log("Using bucket:", process.env.GOOGLE_CLOUD_STORAGE_BUCKET);
    }
  }
} catch (error) {
  console.error("Error initializing Google Cloud Storage:", error.message);
  console.error("Falling back to local storage only");
  storage = null;
}

const bucket =
  storage && process.env.GOOGLE_CLOUD_STORAGE_BUCKET
    ? storage.bucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET)
    : null;

if (bucket) {
  console.log("Google Cloud Storage bucket configured successfully");
} else {
  console.log("Using local file storage");
}

export default {
  storage,
  bucket,
};
