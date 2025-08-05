const multer = require("multer");
// const firebaseStorage = require('multer-firebase-storage');
// const firebase = require('./firebase.config');
// const serviceAccount = require('../your-firebase-service-account.json');

// For local storage (uncomment and configure Firebase storage above for production)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Firebase storage configuration (uncomment when Firebase is configured)
/*
const storage = firebaseStorage({
    credentials: firebase.credential.cert(serviceAccount),
    bucketName: 'your-bucket-name.appspot.com',
    unique: true,
})
*/

const upload = multer({
  storage: storage,
});

module.exports = upload;
