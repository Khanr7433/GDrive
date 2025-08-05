import { Storage } from "@google-cloud/storage";
import dotenv from "dotenv";
dotenv.config();

// Initialize Google Cloud Storage
let storage;

try {
  if (
    process.env.GOOGLE_CLOUD_PROJECT_ID &&
    process.env.GOOGLE_CLOUD_KEY_FILE
  ) {
    // Using service account key file
    storage = new Storage({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE,
    });
  } else if (
    process.env.GOOGLE_CLOUD_PROJECT_ID &&
    process.env.GOOGLE_CLOUD_PRIVATE_KEY
  ) {
    // Using environment variables
    storage = new Storage({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      credentials: {
        client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(
          /\\n/g,
          "\n"
        ),
      },
    });
  } else {
    console.warn("Google Cloud Storage credentials not found");
    storage = null;
  }
} catch (error) {
  console.error("Error initializing Google Cloud Storage:", error);
  storage = null;
}

const bucket = storage
  ? storage.bucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET)
  : null;

export default {
  storage,
  bucket,
};
