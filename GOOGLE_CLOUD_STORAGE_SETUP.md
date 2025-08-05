# Migration to Google Cloud Storage

## Changes Made

### 1. Package Dependencies
- **Removed**: All Firebase-related packages (`@firebase/storage`, `firebase`, `firebase-admin`)
- **Added**: `@google-cloud/storage` and `multer-google-storage` packages
- Updated `package.json` to use Google Cloud Storage SDK

### 2. Google Cloud Storage Configuration (`config/gcs.config.js`)
- Renamed from `firebase.config.js` to `gcs.config.js`
- Configured to use Google Cloud Storage SDK
- Added support for both service account key file and environment variable authentication

### 3. Multer Configuration (`config/multer.config.js`)
- Replaced Firebase storage implementation with `multer-google-storage`
- Configured to upload files to Google Cloud Storage bucket
- Files are set to `publicRead` ACL for easy access
- Maintains fallback to local storage for development

### 4. Routes (`routes/index.routes.js`)
- Updated import from `firebase.config` to `gcs.config`
- Modified upload route to handle Google Cloud Storage file properties
- Updated download route to use Google Cloud Storage public URLs
- Replaced Firebase-specific fields with Google Cloud Storage equivalents

### 5. Database Model (`models/files.models.js`)
- Replaced Firebase fields (`firebaseUrl`, `firebaseKey`, `isFirebaseStorage`) 
- Added Google Cloud Storage fields (`cloudStorageUrl`, `cloudStorageObject`, `isGoogleCloudStorage`)
- Maintains backward compatibility with existing fields

### 6. Environment Configuration (`.env.example`)
- Updated to include Google Cloud Storage configuration variables
- Removed all Firebase-related environment variables
- Added Google Cloud authentication options

## Required Environment Variables

For Google Cloud Storage to work, you need to set these environment variables:

```env
# Google Cloud Storage Configuration
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_STORAGE_BUCKET=your-bucket-name

# Google Cloud Authentication (choose one option)
# Option 1: Use service account key file path
GOOGLE_CLOUD_KEY_FILE=path/to/your/service-account-key.json

# Option 2: Use environment variables
GOOGLE_CLOUD_CLIENT_EMAIL=your-service-account@your-project-id.iam.gserviceaccount.com
GOOGLE_CLOUD_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"

# Storage Configuration
USE_GOOGLE_CLOUD_STORAGE=true
```

## How to Set Up Google Cloud Storage

1. Go to Google Cloud Console (https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Cloud Storage API
4. Create a storage bucket:
   - Go to Cloud Storage > Buckets
   - Click "Create Bucket"
   - Choose a globally unique name
   - Set appropriate location and storage class
5. Create a service account:
   - Go to IAM & Admin > Service Accounts
   - Click "Create Service Account"
   - Give it Storage Admin permissions
   - Download the JSON key file or copy the credentials

## Benefits of Google Cloud Storage

1. **High Performance**: Optimized for large-scale data storage and retrieval
2. **Global CDN**: Built-in content delivery network for fast file access
3. **Security**: Enterprise-grade security and access controls
4. **Cost-Effective**: Pay only for what you use with multiple storage classes
5. **Reliability**: 99.999999999% (11 9's) annual durability
6. **Integration**: Seamless integration with other Google Cloud services
